(function () {
  const BACKUP_SCHEMA_VERSION = 1;
  const BACKUP_FORMAT = "metatech-backup-v1";
  const MAX_BACKUP_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_COUNT_TYPES = new Set(["venta", "jer", "gastos"]);

  function isPlainObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  function stableStringify(value) {
    if (Array.isArray(value)) {
      return `[${value.map(stableStringify).join(",")}]`;
    }

    if (isPlainObject(value)) {
      const keys = Object.keys(value).sort();
      const serialized = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
      return `{${serialized.join(",")}}`;
    }

    return JSON.stringify(value);
  }

  async function createChecksum(value) {
    if (!window.crypto?.subtle) {
      throw new Error("El navegador no soporta verificación criptográfica.");
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function normalizeCount(rawCount, index = 0) {
    if (!isPlainObject(rawCount)) {
      throw new Error(`Registro inválido en posición ${index + 1}.`);
    }

    const { id, date, type, value, description } = rawCount;

    if (typeof id !== "number" || !Number.isFinite(id) || id <= 0) {
      throw new Error(`ID inválido en registro ${index + 1}.`);
    }

    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`Fecha inválida en registro ${index + 1}.`);
    }

    if (!ALLOWED_COUNT_TYPES.has(type)) {
      throw new Error(`Tipo inválido en registro ${index + 1}.`);
    }

    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      throw new Error(`Valor inválido en registro ${index + 1}.`);
    }

    if (typeof description !== "string" || description.trim().length === 0 || description.length > 500) {
      throw new Error(`Descripción inválida en registro ${index + 1}.`);
    }

    return {
      id,
      date,
      type,
      value,
      description,
    };
  }

  function normalizeLocalStorage(rawLocalStorage) {
    if (!isPlainObject(rawLocalStorage)) {
      throw new Error("La sección localStorage del respaldo es inválida.");
    }

    const normalized = {};
    for (const [key, value] of Object.entries(rawLocalStorage)) {
      if (typeof key !== "string" || key.length === 0 || key.length > 200) {
        throw new Error("El respaldo contiene una clave de localStorage inválida.");
      }

      if (typeof value !== "string") {
        throw new Error(`El valor de localStorage para "${key}" debe ser texto.`);
      }

      normalized[key] = value;
    }

    return normalized;
  }

  class DataBackupService {
    constructor({ appName, dbName }) {
      this.appName = appName;
      this.dbName = dbName;
    }

    async ensureDbReady() {
      if (!window.db) {
        await initDB();
      }
    }

    getLocalStorageSnapshot() {
      const snapshot = {};
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (!key) continue;
        snapshot[key] = localStorage.getItem(key) ?? "";
      }
      return snapshot;
    }

    setLocalStorageSnapshot(snapshot) {
      localStorage.clear();
      for (const [key, value] of Object.entries(snapshot)) {
        localStorage.setItem(key, value);
      }
    }

    async collectCurrentData() {
      await this.ensureDbReady();
      const rawCounts = await getAllCounts();
      const counts = rawCounts.map((count, index) => normalizeCount(count, index));
      const localStorageSnapshot = this.getLocalStorageSnapshot();

      return {
        indexedDB: {
          dbName: this.dbName,
          stores: ["counts"],
          counts,
        },
        localStorage: localStorageSnapshot,
      };
    }

    async createBackupPayload() {
      const payloadWithoutIntegrity = {
        metadata: {
          appName: this.appName,
          dbName: this.dbName,
          format: BACKUP_FORMAT,
          schemaVersion: BACKUP_SCHEMA_VERSION,
          exportedAt: new Date().toISOString(),
        },
        data: await this.collectCurrentData(),
      };

      const checksum = await createChecksum(stableStringify(payloadWithoutIntegrity));

      return {
        ...payloadWithoutIntegrity,
        integrity: {
          algorithm: "SHA-256",
          checksum,
        },
      };
    }

    async exportToFile() {
      const payload = await this.createBackupPayload();
      const fileContent = JSON.stringify(payload, null, 2);
      const blob = new Blob([fileContent], { type: "application/json" });
      const dateLabel = new Date().toISOString().split("T")[0];

      return {
        blob,
        fileName: `merkatodo-backup-${dateLabel}.json`,
        payload,
      };
    }

    async parseBackupFile(file) {
      if (!file) {
        throw new Error("No se seleccionó ningún archivo.");
      }

      if (file.size <= 0) {
        throw new Error("El archivo está vacío.");
      }

      if (file.size > MAX_BACKUP_FILE_SIZE) {
        throw new Error("El archivo es demasiado grande para importar.");
      }

      let parsed;
      try {
        const fileContent = await file.text();
        parsed = JSON.parse(fileContent);
      } catch (error) {
        throw new Error("El archivo no tiene formato JSON válido.");
      }

      return this.validateBackupPayload(parsed);
    }

    async validateBackupPayload(payload) {
      if (!isPlainObject(payload)) {
        throw new Error("El contenido del respaldo es inválido.");
      }

      if (!isPlainObject(payload.metadata)) {
        throw new Error("Faltan metadatos del respaldo.");
      }

      if (payload.metadata.format !== BACKUP_FORMAT) {
        throw new Error("Formato de respaldo no compatible.");
      }

      if (payload.metadata.schemaVersion !== BACKUP_SCHEMA_VERSION) {
        throw new Error("Versión de respaldo incompatible.");
      }

      if (!isPlainObject(payload.integrity) || payload.integrity.algorithm !== "SHA-256" || typeof payload.integrity.checksum !== "string") {
        throw new Error("El respaldo no incluye una firma de integridad válida.");
      }

      if (!isPlainObject(payload.data) || !isPlainObject(payload.data.indexedDB)) {
        throw new Error("La estructura de datos del respaldo es inválida.");
      }

      if (!Array.isArray(payload.data.indexedDB.counts)) {
        throw new Error("No se encontró un listado válido de registros.");
      }

      const normalizedCounts = payload.data.indexedDB.counts.map((count, index) => normalizeCount(count, index));
      const uniqueIds = new Set(normalizedCounts.map((count) => count.id));
      if (uniqueIds.size !== normalizedCounts.length) {
        throw new Error("Se detectaron IDs duplicados en el respaldo.");
      }

      const normalizedLocalStorage = normalizeLocalStorage(payload.data.localStorage || {});

      const payloadWithoutIntegrity = {
        metadata: payload.metadata,
        data: {
          indexedDB: {
            dbName: payload.data.indexedDB.dbName || this.dbName,
            stores: Array.isArray(payload.data.indexedDB.stores) ? payload.data.indexedDB.stores : ["counts"],
            counts: normalizedCounts,
          },
          localStorage: normalizedLocalStorage,
        },
      };

      const computedChecksum = await createChecksum(stableStringify(payloadWithoutIntegrity));
      if (computedChecksum !== payload.integrity.checksum) {
        throw new Error("El archivo está corrupto o fue alterado (checksum inválido).");
      }

      return {
        ...payloadWithoutIntegrity,
        integrity: payload.integrity,
      };
    }

    async importBackupPayload(payload) {
      const validatedPayload = await this.validateBackupPayload(payload);
      await this.ensureDbReady();

      const previousCounts = (await getAllCounts()).map((count, index) => normalizeCount(count, index));
      const previousLocalStorage = this.getLocalStorageSnapshot();

      try {
        await replaceAllCounts(validatedPayload.data.indexedDB.counts);
        this.setLocalStorageSnapshot(validatedPayload.data.localStorage);
      } catch (error) {
        try {
          await replaceAllCounts(previousCounts);
          this.setLocalStorageSnapshot(previousLocalStorage);
        } catch (_rollbackError) {
          throw new Error("Falló la restauración y no fue posible revertir automáticamente.");
        }
        throw new Error("No se pudo completar la importación. Se restauró el estado anterior.");
      }

      return validatedPayload;
    }
  }

  function downloadBlob(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  function setupBackupUI() {
    const exportBtn = document.getElementById("btnExportBackup");
    const importBtn = document.getElementById("btnImportBackup");
    const fileInput = document.getElementById("backupFileInput");
    const dropzone = document.getElementById("backupDropzone");
    const status = document.getElementById("backupStatus");

    if (!exportBtn || !importBtn || !fileInput || !dropzone || !status) {
      return;
    }

    const backupService = new DataBackupService({
      appName: "Merkatodo",
      dbName: "CountsMiscelanea",
    });

    let isBusy = false;

    function updateStatus(message, type = "info") {
      status.textContent = message;
      status.classList.remove("is-success", "is-error", "is-info", "is-loading");
      status.classList.add(`is-${type}`);
    }

    function setBusy(value, message = "Procesando...") {
      isBusy = value;
      exportBtn.disabled = value;
      importBtn.disabled = value;
      dropzone.classList.toggle("is-loading", value);
      dropzone.setAttribute("aria-busy", value ? "true" : "false");
      if (value) {
        updateStatus(message, "loading");
      }
    }

    async function handleImportFile(file) {
      if (isBusy) return;

      try {
        setBusy(true, "Validando archivo de respaldo...");
        const payload = await backupService.parseBackupFile(file);
        setBusy(false);

        const totalCounts = payload.data.indexedDB.counts.length;
        const storageKeys = Object.keys(payload.data.localStorage).length;
        const exportedAt = new Date(payload.metadata.exportedAt).toLocaleString("es-CO");

        const confirmMessage = `
          <p>Se detectó un respaldo válido.</p>
          <ul style="margin: 12px 0 0 16px;">
            <li>Registros: <strong>${totalCounts.toLocaleString("es-CO")}</strong></li>
            <li>Claves locales: <strong>${storageKeys.toLocaleString("es-CO")}</strong></li>
            <li>Fecha de exportación: <strong>${exportedAt}</strong></li>
          </ul>
          <p style="margin-top: 12px;">Esta acción sobrescribirá todos los datos actuales.</p>
        `;

        let confirmed = false;
        if (typeof showConfirmModal === "function") {
          confirmed = await showConfirmModal({
            title: "Restaurar respaldo",
            message: confirmMessage,
            type: "warning",
            confirmText: "Sí, restaurar",
            cancelText: "Cancelar",
          });
        } else {
          confirmed = window.confirm("Esta acción sobrescribirá todos los datos actuales. ¿Deseas continuar?");
        }

        if (!confirmed) {
          updateStatus("Importación cancelada por el usuario.", "info");
          return;
        }

        setBusy(true, "Restaurando datos...");
        await backupService.importBackupPayload(payload);
        setBusy(false);

        updateStatus("Respaldo restaurado correctamente. Recargando aplicación...", "success");
        if (typeof showToast === "function") {
          showToast("Importación exitosa", "Todos los datos fueron restaurados correctamente.", "success");
        }

        setTimeout(() => {
          window.location.reload();
        }, 900);
      } catch (error) {
        setBusy(false);
        updateStatus(error.message || "No se pudo importar el respaldo.", "error");
        if (typeof showToast === "function") {
          showToast("Error al importar", error.message || "No se pudo importar el respaldo.", "error", 5000);
        }
      } finally {
        fileInput.value = "";
      }
    }

    exportBtn.addEventListener("click", async () => {
      if (isBusy) return;

      try {
        setBusy(true, "Preparando respaldo...");
        const { blob, fileName, payload } = await backupService.exportToFile();
        downloadBlob(blob, fileName);
        setBusy(false);

        const totalCounts = payload.data.indexedDB.counts.length;
        const storageKeys = Object.keys(payload.data.localStorage).length;
        updateStatus(
          `Respaldo generado: ${totalCounts.toLocaleString("es-CO")} registros y ${storageKeys.toLocaleString("es-CO")} claves locales.`,
          "success",
        );
        if (typeof showToast === "function") {
          showToast("Respaldo listo", "La descarga del respaldo inició correctamente.", "success");
        }
      } catch (error) {
        setBusy(false);
        updateStatus(error.message || "No se pudo exportar el respaldo.", "error");
        if (typeof showToast === "function") {
          showToast("Error al exportar", error.message || "No se pudo exportar el respaldo.", "error", 5000);
        }
      }
    });

    importBtn.addEventListener("click", () => {
      if (isBusy) return;
      fileInput.click();
    });

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (file) {
        handleImportFile(file);
      }
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        if (isBusy) return;
        dropzone.classList.add("is-dragging");
      });
    });

    ["dragleave", "dragend"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.remove("is-dragging");
      });
    });

    dropzone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropzone.classList.remove("is-dragging");
      if (isBusy) return;

      const file = event.dataTransfer?.files?.[0];
      if (!file) {
        updateStatus("No se detectó ningún archivo para importar.", "error");
        return;
      }

      handleImportFile(file);
    });

    dropzone.addEventListener("click", () => {
      if (isBusy) return;
      fileInput.click();
    });

    dropzone.addEventListener("keydown", (event) => {
      if (isBusy) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fileInput.click();
      }
    });

    updateStatus("Puedes exportar un respaldo completo o importar uno existente.", "info");
  }

  document.addEventListener("DOMContentLoaded", setupBackupUI);
})();

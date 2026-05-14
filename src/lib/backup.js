import { getAllCounts, replaceAllCounts } from './db.js';
import { STORAGE_KEYS } from './constants.js';

const BACKUP_SCHEMA_VERSION = 1;
const BACKUP_FORMAT = 'metatech-backup-v1';
const MAX_BACKUP_FILE_SIZE = 10 * 1024 * 1024;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_LOCALSTORAGE_KEY_LENGTH = 200;
const ALLOWED_COUNT_TYPES = new Set(['venta', 'jer', 'gastos']);

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (isPlainObject(value)) {
    const keys = Object.keys(value).sort();
    const serialized = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
    return `{${serialized.join(',')}}`;
  }

  return JSON.stringify(value);
}

async function createChecksum(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function normalizeCount(rawCount, index = 0) {
  if (!isPlainObject(rawCount)) {
    throw new Error(`Registro invalido en posicion ${index + 1}.`);
  }

  const { id, date, type, value, description } = rawCount;

  if (typeof id !== 'number' || !Number.isFinite(id) || id <= 0) {
    throw new Error(`ID invalido en registro ${index + 1}.`);
  }

  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`Fecha invalida en registro ${index + 1}.`);
  }

  if (!ALLOWED_COUNT_TYPES.has(type)) {
    throw new Error(`Tipo invalido en registro ${index + 1}.`);
  }

  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new Error(`Valor invalido en registro ${index + 1}.`);
  }

  if (
    typeof description !== 'string' ||
    description.trim().length === 0 ||
    description.length > MAX_DESCRIPTION_LENGTH
  ) {
    throw new Error(`Descripcion invalida en registro ${index + 1}.`);
  }

  return { id, date, type, value, description };
}

function normalizeLocalStorage(rawLocalStorage) {
  if (!isPlainObject(rawLocalStorage)) {
    throw new Error('La seccion localStorage del respaldo es invalida.');
  }

  const normalized = {};
  for (const [key, value] of Object.entries(rawLocalStorage)) {
    if (typeof key !== 'string' || key.length === 0 || key.length > MAX_LOCALSTORAGE_KEY_LENGTH) {
      throw new Error('El respaldo contiene una clave localStorage invalida.');
    }

    if (typeof value !== 'string') {
      throw new Error('El respaldo contiene valores localStorage invalidos.');
    }

    normalized[key] = value;
  }

  return normalized;
}

function getLocalStorageSnapshot() {
  const snapshot = {};
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    snapshot[key] = localStorage.getItem(key) ?? '';
  });
  return snapshot;
}

function setLocalStorageSnapshot(snapshot) {
  localStorage.clear();
  Object.entries(snapshot).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
}

export async function createBackupPayload() {
  const counts = (await getAllCounts()).map((count, index) => normalizeCount(count, index));
  const localStorageSnapshot = getLocalStorageSnapshot();

  const payloadWithoutIntegrity = {
    metadata: {
      appName: 'Merkatodo',
      format: BACKUP_FORMAT,
      schemaVersion: BACKUP_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
    },
    data: {
      indexedDB: {
        dbName: 'CountsMiscelanea',
        stores: ['counts'],
        counts,
      },
      localStorage: localStorageSnapshot,
    },
  };

  const checksum = await createChecksum(stableStringify(payloadWithoutIntegrity));

  return {
    ...payloadWithoutIntegrity,
    integrity: {
      algorithm: 'SHA-256',
      checksum,
    },
  };
}

export async function exportBackupFile() {
  const payload = await createBackupPayload();
  const fileContent = JSON.stringify(payload, null, 2);
  const blob = new Blob([fileContent], { type: 'application/json' });
  const dateLabel = new Date().toISOString().split('T')[0];

  return {
    blob,
    fileName: `merkatodo-backup-${dateLabel}.json`,
    payload,
  };
}

export async function parseBackupFile(file) {
  if (!file) {
    throw new Error('No se selecciono ningun archivo.');
  }

  if (file.size <= 0) {
    throw new Error('El archivo esta vacio.');
  }

  if (file.size > MAX_BACKUP_FILE_SIZE) {
    throw new Error('El archivo es demasiado grande para importar.');
  }

  let parsed;
  try {
    const fileContent = await file.text();
    parsed = JSON.parse(fileContent);
  } catch (error) {
    throw new Error('El archivo no tiene formato JSON valido.');
  }

  return validateBackupPayload(parsed);
}

async function validateBackupPayload(payload) {
  if (!isPlainObject(payload)) {
    throw new Error('El contenido del respaldo es invalido.');
  }

  if (!isPlainObject(payload.metadata)) {
    throw new Error('Faltan metadatos del respaldo.');
  }

  if (payload.metadata.format !== BACKUP_FORMAT) {
    throw new Error('Formato de respaldo no compatible.');
  }

  if (payload.metadata.schemaVersion !== BACKUP_SCHEMA_VERSION) {
    throw new Error('Version de respaldo incompatible.');
  }

  if (!isPlainObject(payload.integrity) || payload.integrity.algorithm !== 'SHA-256') {
    throw new Error('El respaldo no incluye una firma valida.');
  }

  if (!isPlainObject(payload.data) || !isPlainObject(payload.data.indexedDB)) {
    throw new Error('La estructura de datos del respaldo es invalida.');
  }

  if (!Array.isArray(payload.data.indexedDB.counts)) {
    throw new Error('No se encontro un listado valido de registros.');
  }

  const normalizedCounts = payload.data.indexedDB.counts.map((count, index) => normalizeCount(count, index));
  const uniqueIds = new Set(normalizedCounts.map((count) => count.id));
  if (uniqueIds.size !== normalizedCounts.length) {
    throw new Error('Se detectaron IDs duplicados en el respaldo.');
  }

  const normalizedLocalStorage = normalizeLocalStorage(payload.data.localStorage || {});

  const payloadWithoutIntegrity = {
    metadata: payload.metadata,
    data: {
      indexedDB: {
        dbName: payload.data.indexedDB.dbName || 'CountsMiscelanea',
        stores: Array.isArray(payload.data.indexedDB.stores) ? payload.data.indexedDB.stores : ['counts'],
        counts: normalizedCounts,
      },
      localStorage: normalizedLocalStorage,
    },
  };

  const computedChecksum = await createChecksum(stableStringify(payloadWithoutIntegrity));
  if (computedChecksum !== payload.integrity.checksum) {
    throw new Error('El archivo esta corrupto o fue alterado.');
  }

  return {
    ...payloadWithoutIntegrity,
    integrity: payload.integrity,
  };
}

export async function importBackupPayload(payload) {
  const validatedPayload = await validateBackupPayload(payload);
  const previousCounts = (await getAllCounts()).map((count, index) => normalizeCount(count, index));
  const previousLocalStorage = getLocalStorageSnapshot();

  try {
    await replaceAllCounts(validatedPayload.data.indexedDB.counts);
    setLocalStorageSnapshot(validatedPayload.data.localStorage);
  } catch (error) {
    try {
      await replaceAllCounts(previousCounts);
      setLocalStorageSnapshot(previousLocalStorage);
    } catch (_rollbackError) {
      throw new Error('La importacion fallo y no se pudo restaurar el estado anterior.');
    }
    throw new Error('No se pudo completar la importacion. Se restauro el estado anterior.');
  }

  return validatedPayload;
}

export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function getBackupLocalStorageKeys(payload) {
  if (!payload?.data?.localStorage) return [];
  return Object.keys(payload.data.localStorage).filter((key) => !key.startsWith('react-'));
}

export { STORAGE_KEYS };

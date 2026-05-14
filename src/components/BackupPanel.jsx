import { useRef, useState } from 'react';
import { downloadBlob, exportBackupFile, getBackupLocalStorageKeys, importBackupPayload, parseBackupFile } from '../lib/backup.js';
import { useConfirm } from './ConfirmProvider.jsx';
import { useToast } from './ToastProvider.jsx';
import Spinner from './ui/Spinner.jsx';

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const STEPS = {
  idle: null,
  preparing: 'Preparando respaldo...',
  validating: 'Validando archivo...',
  restoring: 'Restaurando datos...',
  reloading: 'Aplicando cambios...',
};

function BackupPanel() {
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const [step, setStep] = useState('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [dragging, setDragging] = useState(false);
  const [lastExport, setLastExport] = useState('');
  const busy = step !== 'idle';
  const { confirm } = useConfirm();
  const { push } = useToast();

  function setStatus(s, msg = '') {
    setStep(s);
    setStatusMsg(msg);
  }

  async function handleExport() {
    if (busy) return;
    try {
      setStatus('preparing');
      const { blob, fileName, payload } = await exportBackupFile();
      downloadBlob(blob, fileName);
      const totalCounts = payload.data.indexedDB.counts.length;
      const storageKeys = getBackupLocalStorageKeys(payload).length;
      const now = new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
      setLastExport(`${now} · ${totalCounts} registros`);
      setStatus('idle', `Respaldo generado: ${totalCounts} registros y ${storageKeys} claves locales.`);
      push({ title: 'Respaldo listo', message: `${totalCounts} registros exportados.`, variant: 'success' });
    } catch (error) {
      setStatus('idle');
      push({ title: 'Error al exportar', message: error.message || 'No se pudo exportar el respaldo.', variant: 'error' });
    }
  }

  async function handleImport(file) {
    if (busy || !file) return;
    try {
      setStatus('validating');
      const payload = await parseBackupFile(file);
      const totalCounts = payload.data.indexedDB.counts.length;
      const storageKeys = getBackupLocalStorageKeys(payload).length;

      const confirmed = await confirm({
        title: 'Restaurar respaldo',
        message: `Se restaurarán ${totalCounts} registros y ${storageKeys} entradas de almacenamiento local. Esta acción sobrescribirá todos los datos actuales.`,
        confirmText: 'Sí, restaurar',
      });

      if (!confirmed) {
        setStatus('idle', 'Importación cancelada.');
        return;
      }

      setStatus('restoring');
      await importBackupPayload(payload);
      setStatus('reloading', 'Respaldo restaurado. Recargando aplicación...');
      push({ title: 'Importación exitosa', message: `${totalCounts} registros restaurados.`, variant: 'success' });
      setTimeout(() => window.location.reload(), 1200);
    } catch (error) {
      setStatus('idle');
      push({ title: 'Error al importar', message: error.message || 'Archivo inválido o corrupto.', variant: 'error' });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function onDragEnter(e) { e.preventDefault(); setDragging(true); }
  function onDragLeave(e) { e.preventDefault(); setDragging(false); }
  function onDragOver(e) { e.preventDefault(); }
  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImport(file);
  }

  const stepLabel = STEPS[step];

  return (
    <section className="card p-6 sm:p-8" aria-labelledby="backup-heading">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
              <ShieldIcon />
            </div>
            <div>
              <p className="section-eyebrow">Seguridad</p>
              <h2 id="backup-heading" className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Respaldo y restauración
              </h2>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Exporta una copia segura o restaura desde un respaldo. Los archivos incluyen verificación SHA-256.
          </p>
          {lastExport && (
            <p className="mt-1.5 text-xs text-slate-400">
              Último respaldo: <span className="font-medium">{lastExport}</span>
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          className="btn-primary"
          type="button"
          onClick={handleExport}
          disabled={busy}
        >
          {step === 'preparing' ? <><Spinner size="sm" className="text-white" /> Preparando...</> : <><DownloadIcon /> Exportar datos</>}
        </button>
        <button
          className="btn-ghost"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
        >
          {step === 'validating' || step === 'restoring' ? <><Spinner size="sm" /> {stepLabel}</> : <><UploadIcon /> Importar respaldo</>}
        </button>
      </div>

      {/* Drop zone */}
      <div
        ref={dropZoneRef}
        className={`drop-zone flex flex-col items-center justify-center gap-3 px-6 py-10 text-center transition-all duration-200 ${
          dragging ? 'drop-zone-active' : ''
        } ${busy ? 'pointer-events-none opacity-60' : ''}`}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        role="region"
        aria-label="Zona de arrastre para importar respaldo"
      >
        {busy && step !== 'idle' ? (
          <>
            <Spinner size="lg" />
            <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">{stepLabel}</p>
          </>
        ) : (
          <>
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
              dragging
                ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            }`}>
              <UploadIcon />
            </div>
            <div>
              <p className={`text-sm font-semibold transition-colors ${
                dragging ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300'
              }`}>
                {dragging ? 'Suelta el archivo aquí' : 'Arrastra un archivo .json aquí'}
              </p>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                {statusMsg || 'o usa el botón "Importar respaldo" para seleccionarlo'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Security notes */}
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {[
          { icon: '🔐', text: 'Verificación SHA-256 de integridad' },
          { icon: '↩️', text: 'Reversión automática en caso de error' },
          { icon: '📦', text: 'Incluye registros y configuración' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50">
            <span className="text-base">{icon}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{text}</span>
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); }}
      />
    </section>
  );
}

export default BackupPanel;

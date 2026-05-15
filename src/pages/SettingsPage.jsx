import { useState } from 'react';
import { useDarkMode } from '../lib/useDarkMode.js';
import BackupPanel from '../components/BackupPanel.jsx';

function Section({ title, description, icon, children }) {
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
          {icon}
        </div>
        <div>
          <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      </div>
      <div className="divide-y divide-slate-50 dark:divide-slate-800/60">{children}</div>
    </section>
  );
}

function SettingRow({ label, description, children, badge }) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
          {badge && (
            <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
              {badge}
            </span>
          )}
        </div>
        {description && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
        checked ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input w-auto min-w-[130px] py-2 text-xs"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function InfoBadge({ text, variant = 'neutral' }) {
  const cls = {
    neutral: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
  };
  return (
    <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold ${cls[variant]}`}>
      {text}
    </span>
  );
}

function SessionCard({ device, location, date, current }) {
  return (
    <div className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 ${current ? 'border-brand-200 bg-brand-50/50 dark:border-brand-800/50 dark:bg-brand-900/20' : 'border-slate-100 dark:border-slate-800'}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${current ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{device}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{location} · {date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {current ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Activa
          </span>
        ) : (
          <button type="button" className="btn-ghost btn-sm text-rose-500 hover:text-rose-600 dark:text-rose-400">
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
}

function SettingsPage() {
  const { dark, toggle } = useDarkMode();

  const [notifications, setNotifications] = useState({
    saves: true,
    errors: true,
    backups: false,
    weekly: true,
  });

  const [privacy, setPrivacy] = useState({
    analytics: false,
    crashReports: true,
  });

  const [preferences, setPreferences] = useState({
    currency: 'COP',
    dateFormat: 'DD/MM/YYYY',
    rowsPerPage: '20',
    compactMode: false,
    animations: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '8h',
    loginAlerts: true,
  });

  const appVersion = '2.4.0';

  function handleClearData() {
    if (window.confirm('¿Estás seguro? Esta acción eliminará todas las preferencias locales y no se puede deshacer.')) {
      localStorage.clear();
      window.location.reload();
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 animate-fade-in">

      {/* Header */}
      <div>
        <p className="section-eyebrow">Sistema</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Ajustes
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configuración, seguridad y preferencias del sistema
        </p>
      </div>

      {/* Apariencia */}
      <Section
        title="Apariencia y personalización"
        description="Adapta la interfaz a tu preferencia visual"
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>}
      >
        <SettingRow label="Modo oscuro" description="Interfaz con fondo oscuro para mejor visión nocturna">
          <Toggle checked={dark} onChange={toggle} label="Activar modo oscuro" />
        </SettingRow>
        <SettingRow label="Animaciones" description="Transiciones y efectos de movimiento en la interfaz">
          <Toggle
            checked={preferences.animations}
            onChange={(v) => setPreferences((p) => ({ ...p, animations: v }))}
            label="Activar animaciones"
          />
        </SettingRow>
        <SettingRow label="Modo compacto" description="Reduce el espaciado para mostrar más contenido" badge="Beta">
          <Toggle
            checked={preferences.compactMode}
            onChange={(v) => setPreferences((p) => ({ ...p, compactMode: v }))}
            label="Activar modo compacto"
          />
        </SettingRow>
        <SettingRow label="Filas por página" description="Cantidad predeterminada en tablas de datos">
          <Select
            value={preferences.rowsPerPage}
            onChange={(v) => setPreferences((p) => ({ ...p, rowsPerPage: v }))}
            options={[
              { value: '10', label: '10 filas' },
              { value: '20', label: '20 filas' },
              { value: '50', label: '50 filas' },
              { value: '100', label: '100 filas' },
            ]}
          />
        </SettingRow>
      </Section>

      {/* Preferencias regionales */}
      <Section
        title="Preferencias del sistema"
        description="Formatos regionales y configuración de visualización"
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>}
      >
        <SettingRow label="Moneda" description="Divisa para mostrar valores financieros">
          <Select
            value={preferences.currency}
            onChange={(v) => setPreferences((p) => ({ ...p, currency: v }))}
            options={[
              { value: 'COP', label: 'COP — Peso colombiano' },
              { value: 'USD', label: 'USD — Dólar americano' },
              { value: 'EUR', label: 'EUR — Euro' },
            ]}
          />
        </SettingRow>
        <SettingRow label="Formato de fecha" description="Forma en que se muestran las fechas">
          <Select
            value={preferences.dateFormat}
            onChange={(v) => setPreferences((p) => ({ ...p, dateFormat: v }))}
            options={[
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
            ]}
          />
        </SettingRow>
        <SettingRow label="Versión de la app" description="Versión instalada actualmente">
          <InfoBadge text={`v${appVersion}`} variant="brand" />
        </SettingRow>
      </Section>

      {/* Notificaciones */}
      <Section
        title="Notificaciones"
        description="Controla qué alertas y mensajes quieres recibir"
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>}
      >
        <SettingRow label="Guardados exitosos" description="Notificar cuando se registra una operación">
          <Toggle checked={notifications.saves} onChange={(v) => setNotifications((n) => ({ ...n, saves: v }))} label="Notificaciones de guardado" />
        </SettingRow>
        <SettingRow label="Errores del sistema" description="Alertas cuando ocurre un fallo o error">
          <Toggle checked={notifications.errors} onChange={(v) => setNotifications((n) => ({ ...n, errors: v }))} label="Notificaciones de error" />
        </SettingRow>
        <SettingRow label="Recordatorios de respaldo" description="Alertas para realizar copias de seguridad" badge="Próximo">
          <Toggle checked={notifications.backups} onChange={(v) => setNotifications((n) => ({ ...n, backups: v }))} label="Notificaciones de respaldo" />
        </SettingRow>
        <SettingRow label="Resumen semanal" description="Informe automático de rendimiento al final de la semana" badge="Próximo">
          <Toggle checked={notifications.weekly} onChange={(v) => setNotifications((n) => ({ ...n, weekly: v }))} label="Resumen semanal" />
        </SettingRow>
      </Section>

      {/* Seguridad */}
      <Section
        title="Seguridad de la cuenta"
        description="Protege tu cuenta y gestiona el acceso"
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
      >
        <SettingRow label="Verificación en dos pasos" description="Capa adicional de seguridad para el inicio de sesión" badge="Próximo">
          <Toggle checked={security.twoFactor} onChange={(v) => setSecurity((s) => ({ ...s, twoFactor: v }))} label="Verificación en dos pasos" />
        </SettingRow>
        <SettingRow label="Alertas de inicio de sesión" description="Notificar cuando se accede desde un dispositivo nuevo">
          <Toggle checked={security.loginAlerts} onChange={(v) => setSecurity((s) => ({ ...s, loginAlerts: v }))} label="Alertas de login" />
        </SettingRow>
        <SettingRow label="Tiempo de sesión" description="Cerrar sesión automáticamente después de inactividad">
          <Select
            value={security.sessionTimeout}
            onChange={(v) => setSecurity((s) => ({ ...s, sessionTimeout: v }))}
            options={[
              { value: '1h', label: '1 hora' },
              { value: '4h', label: '4 horas' },
              { value: '8h', label: '8 horas' },
              { value: 'never', label: 'Nunca' },
            ]}
          />
        </SettingRow>
        <SettingRow label="Nivel de seguridad">
          <InfoBadge text="Estándar" variant="warning" />
        </SettingRow>
      </Section>

      {/* Respaldo y restauración */}
      <BackupPanel />

      {/* Privacidad */}
      <Section
        title="Privacidad"
        description="Controla qué datos se comparten"
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
      >
        <SettingRow label="Análisis de uso" description="Compartir datos anónimos para mejorar la experiencia" badge="Próximo">
          <Toggle checked={privacy.analytics} onChange={(v) => setPrivacy((p) => ({ ...p, analytics: v }))} label="Análisis anónimo" />
        </SettingRow>
        <SettingRow label="Reportes de fallos" description="Enviar automáticamente errores para diagnóstico">
          <Toggle checked={privacy.crashReports} onChange={(v) => setPrivacy((p) => ({ ...p, crashReports: v }))} label="Reportes de fallos" />
        </SettingRow>
        <SettingRow label="Almacenamiento de datos" description="Todos los datos se guardan localmente en este dispositivo">
          <InfoBadge text="Solo local" variant="success" />
        </SettingRow>
      </Section>

      {/* Sesiones activas */}
      <Section
        title="Gestión de sesiones"
        description="Dispositivos donde tienes la aplicación abierta"
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
      >
        <div className="flex flex-col gap-3 px-6 py-4">
          <SessionCard device="Este dispositivo" location="Colombia" date="Ahora" current />
        </div>
      </Section>

      {/* Integraciones */}
      <Section
        title="Integraciones y conexiones"
        description="Servicios externos conectados a la aplicación"
        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>}
      >
        <SettingRow label="WhatsApp Business" description="Envío de listas de pedidos vía WhatsApp">
          <InfoBadge text="Conectado" variant="success" />
        </SettingRow>
        <SettingRow label="Almacenamiento en la nube" description="Sincronización automática de respaldos" badge="Próximo">
          <InfoBadge text="No conectado" variant="neutral" />
        </SettingRow>
        <SettingRow label="Google Sheets" description="Exportación automática de registros a hojas de cálculo" badge="Próximo">
          <InfoBadge text="No conectado" variant="neutral" />
        </SettingRow>
      </Section>

      {/* Zona de peligro */}
      <section className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 dark:border-rose-800/40 dark:bg-rose-900/10">
        <h2 className="font-display mb-1 text-base font-bold text-rose-700 dark:text-rose-400">Zona de riesgo</h2>
        <p className="mb-4 text-xs text-rose-600/80 dark:text-rose-400/70">
          Estas acciones son irreversibles. Procede con cuidado.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleClearData}
            className="btn border border-rose-300 bg-white text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-900/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
            Limpiar preferencias locales
          </button>
        </div>
      </section>

    </div>
  );
}

export default SettingsPage;

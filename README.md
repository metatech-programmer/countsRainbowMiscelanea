# Merkatodo — Sistema de Autoservicio

Plataforma moderna de gestión comercial diaria para autoservicio. Registra ventas, JER y gastos, consulta historial, analiza estadísticas y gestiona pedidos — todo offline, rápido y desde cualquier dispositivo.

## Características

- **Registro diario** — Captura ventas, JER y gastos con atajos de teclado (V/J/G) y autocompletado inteligente
- **Historial** — Filtros avanzados, ordenamiento, búsqueda y exportación CSV
- **Estadísticas** — 3 gráficos (tendencia, distribución, comparativa), presets de período e insights automáticos
- **Lista de pedidos** — Checklist con estados, envío por WhatsApp
- **Modo oscuro** — Persistente, respeta preferencia del sistema operativo
- **Respaldo** — Exportación/importación JSON con verificación SHA-256 y drag & drop
- **Reproductor de música** — Playlist de Audius con controles completos y volumen persistente
- **Offline-first** — Todos los datos en IndexedDB, sin servidor requerido

## Stack

| Tecnología | Versión |
|---|---|
| React | 18 |
| Vite | 5 |
| Tailwind CSS | 3 |
| Chart.js | 4 |
| idb (IndexedDB) | 8 |

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # Genera dist/
npm run preview    # Previsualiza el build
```

## Estructura del proyecto

```
src/
├── main.jsx
├── App.jsx
├── styles/
│   └── index.css          # Design system completo (tokens, componentes, utilidades)
├── lib/
│   ├── constants.js        # Constantes globales y colores de tipos
│   ├── utils.js            # Formateo de moneda, fechas
│   ├── db.js               # API IndexedDB (idb)
│   ├── backup.js           # Exportar/importar con SHA-256
│   ├── useDarkMode.js      # Hook modo oscuro con persistencia
│   ├── useRequestState.js  # Hook estado async (idle/loading/success/error)
│   └── useVirtualList.js   # Virtualización para listas grandes
├── components/
│   ├── PageShell.jsx
│   ├── Navigation.jsx      # Responsive, iconos SVG, dark mode toggle
│   ├── BackupPanel.jsx     # Drag & drop, progreso paso a paso
│   ├── ToastProvider.jsx   # Notificaciones con dismiss manual
│   ├── ConfirmProvider.jsx # Modal accesible con focus trap
│   └── ui/
│       ├── KpiCard.jsx
│       ├── TransactionBadge.jsx
│       ├── Spinner.jsx
│       └── EmptyState.jsx
└── pages/
    ├── HomePage.jsx        # Dashboard + registro + pedidos
    ├── HistoryPage.jsx     # Historial con virtualización
    ├── StatsPage.jsx       # Analítica con 3 gráficos
    └── AudioPage.jsx       # Reproductor Audius
```

## Respaldo de datos

El sistema exporta un archivo `.json` con:
- Todos los registros de IndexedDB
- Configuración de localStorage
- Checksum SHA-256 de integridad

Para restaurar: arrastra el archivo al panel de respaldo o usa el botón "Importar". El sistema valida la integridad antes de sobrescribir y revierte automáticamente si hay un error.

## Despliegue

El proyecto genera un SPA estático en `dist/`. Compatible con Vercel, Netlify, GitHub Pages o cualquier hosting estático.

Para Vercel añade un `vercel.json` con rewrites si usas rutas del router:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

Desarrollado por **Metatech** para Merkatodo.

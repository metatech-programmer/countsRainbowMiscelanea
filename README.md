# 🛒 Merkatodo - Sistema de Autoservicio

Sistema profesional de gestión de ventas, gastos y operaciones para autoservicio, diseñado con un enfoque minimalista, intuitivo y optimizado para uso rápido.

## ✨ Características Principales

- **Registro de Operaciones**: Gestión rápida de ventas, JER y gastos
- **Historial Completo**: Consulta por día, mes o año
- **Estadísticas Visuales**: Gráficos interactivos de rendimiento
- **Lista de Pedidos**: Sistema de gestión de productos pendientes
- **Diseño Responsivo**: Optimizado para tablets, móviles y escritorio

## 🎨 Mejoras de UI/UX (Diciembre 2025)

### Diseño Minimalista Profesional
- ✅ Paleta de colores reducida y profesional (azul principal)
- ✅ Espaciado amplio para mejor legibilidad
- ✅ Tipografía mejorada con mejor jerarquía visual
- ✅ Elementos más grandes para facilitar uso en autoservicio
- ✅ Animaciones sutiles y rápidas

### Experiencia de Usuario Mejorada
- ✅ Navegación clara con logo de marca "MERKATODO"
- ✅ Indicadores visuales intuitivos (subrayado activo)
- ✅ Botones de acción prominentes con mejor contraste
- ✅ Formularios simplificados con inputs más grandes
- ✅ Tarjetas de información con jerarquía clara
- ✅ Sistema de respaldo completo (exportar/importar datos)

### Rendimiento y Accesibilidad
- ✅ Colores con suficiente contraste (WCAG AA)
- ✅ Tamaños de fuente legibles (mínimo 16px en inputs)
- ✅ Áreas de toque grandes (mínimo 48px)
- ✅ Feedback visual inmediato en interacciones
- ✅ Diseño mobile-first optimizado

## 🚀 Tecnologías

- HTML5 semántico
- CSS3 moderno (Variables CSS, Grid, Flexbox)
- JavaScript vanilla
- IndexedDB para almacenamiento local
- Chart.js para visualizaciones

## 📱 Responsive Design

El sistema está optimizado para:
- 📱 Móviles (320px - 480px)
- 📱 Tablets (481px - 768px)
- 💻 Desktop (769px+)

## 🎯 Uso

1. **Registro de Operaciones**: Selecciona el tipo (Venta/JER/Gasto), ingresa el monto y descripción
2. **Consulta de Historial**: Filtra por día, mes o año para ver resúmenes
3. **Estadísticas**: Visualiza tendencias con gráficos interactivos
4. **Lista de Pedidos**: Gestiona productos pendientes con el panel lateral

## 💾 Respaldo e Importación de Datos

- En la pantalla principal encontrarás el panel **Respaldo y restauración**.
- Usa **Exportar datos** para descargar un JSON con todos los datos persistentes:
  - Registros almacenados en IndexedDB (`counts`)
  - Datos de `localStorage` de la aplicación
- Usa **Importar respaldo** (botón o drag & drop) para restaurar el estado completo.
- El sistema valida:
  - Estructura del archivo
  - Versión de formato
  - Integridad criptográfica (SHA-256)
  - Registros corruptos o incompatibles
- Antes de sobrescribir, se solicita confirmación explícita.
- Si ocurre un error durante la importación, el sistema intenta revertir al estado previo para evitar pérdidas.

## 🎨 Sistema de Diseño

### Colores Principales
- **Primary**: `#2563eb` (Azul profesional)
- **Success**: `#10b981` (Verde para ventas)
- **Info**: `#3b82f6` (Azul para JER)
- **Danger**: `#ef4444` (Rojo para gastos)

### Espaciado
- Amplio espaciado entre elementos (24px-48px)
- Padding generoso en botones y tarjetas
- Márgenes consistentes en todo el sistema

### Tipografía
- Sistema de fuentes nativas para mejor rendimiento
- Escala de tamaños clara (0.75rem - 3rem)
- Pesos de fuente consistentes (600-800)

---

**Desarrollado con ❤️ por Metatech** | Optimizado para Merkatodo 🛒

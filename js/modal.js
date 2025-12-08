// Sistema de Modales y Notificaciones Toast

// Crear contenedor de toasts si no existe
function createToastContainer() {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

// Mostrar Toast Notification
function showToast(title, message, type = 'info', duration = 3000) {
  createToastContainer();
  const container = document.querySelector('.toast-container');
  
  const icons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
  };
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;
  
  container.appendChild(toast);
  
  // Cerrar al hacer clic en X
  toast.querySelector('.toast-close').addEventListener('click', () => {
    removeToast(toast);
  });
  
  // Auto-cerrar después de la duración especificada
  if (duration > 0) {
    setTimeout(() => {
      removeToast(toast);
    }, duration);
  }
  
  return toast;
}

function removeToast(toast) {
  toast.classList.add('removing');
  setTimeout(() => {
    toast.remove();
  }, 300);
}

// Mostrar Modal de Confirmación
function showConfirmModal(options) {
  return new Promise((resolve) => {
    const {
      title = '¿Estás seguro?',
      message = '',
      type = 'danger',
      confirmText = 'Confirmar',
      cancelText = 'Cancelar',
      onConfirm = () => {},
      onCancel = () => {}
    } = options;
    
    const icons = {
      danger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <div class="modal-icon ${type}">
            ${icons[type]}
          </div>
          <h3 class="modal-title">${title}</h3>
        </div>
        <div class="modal-body">
          ${message}
        </div>
        <div class="modal-footer">
          <button class="modal-btn-cancel">${cancelText}</button>
          <button class="modal-btn-confirm ${type}">${confirmText}</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Animar entrada
    setTimeout(() => overlay.classList.add('active'), 10);
    
    const modal = overlay.querySelector('.modal');
    const btnCancel = overlay.querySelector('.modal-btn-cancel');
    const btnConfirm = overlay.querySelector('.modal-btn-confirm');
    
    function closeModal(confirmed) {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.remove();
      }, 300);
      
      if (confirmed) {
        onConfirm();
        resolve(true);
      } else {
        onCancel();
        resolve(false);
      }
    }
    
    btnCancel.addEventListener('click', () => closeModal(false));
    btnConfirm.addEventListener('click', () => closeModal(true));
    
    // Cerrar al hacer clic fuera del modal
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(false);
      }
    });
    
    // Cerrar con tecla ESC
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal(false);
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  });
}

// Exportar funciones globalmente
window.showToast = showToast;
window.showConfirmModal = showConfirmModal;

const dataMonthSearch = document.getElementById("dateMonthSearch");
const dataDaySearch = document.getElementById("dateDaySearch");
const dataYearSearch = document.getElementById("dateYearSearch");
const countsTable = document.getElementById("counts");
const messageResultNoData = document.querySelector(".messageResultNoData");
const messageResultData = document.querySelector(".messageResultData");
let totalVenta = document.getElementById("totalVenta");
let totalJER = document.getElementById("totalJER");
let totalGastos = document.getElementById("totalGastos");
const btnSearch = document.getElementById("btnSearch");
const btnSearchDay = document.getElementById("btnSearchDay");
const btnSearchYear = document.getElementById("btnSearchYear");

// Variables de paginación
let currentHistoryPage = 1;
let historyRowsPerPage = 10;
let totalHistoryRows = 0;
let allHistoryCounts = [];

document.addEventListener("DOMContentLoaded", () => {
  initDB()
    .then(() => {
      setupHistoryPagination();
      renderAllCounts();
    })
    .catch((error) => {
      console.error("Error al inicializar la base de datos:", error);
    });
});

function setupHistoryPagination() {
  const rowsPerPageSelect = document.getElementById('historyRowsPerPage');
  const firstPageBtn = document.getElementById('historyFirstPage');
  const prevPageBtn = document.getElementById('historyPrevPage');
  const nextPageBtn = document.getElementById('historyNextPage');
  const lastPageBtn = document.getElementById('historyLastPage');

  if (!rowsPerPageSelect) return; // Si no existe el elemento, salir

  // Cambiar filas por página
  rowsPerPageSelect.addEventListener('change', (e) => {
    historyRowsPerPage = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
    currentHistoryPage = 1;
    renderCounts(allHistoryCounts);
  });

  // Primera página
  firstPageBtn?.addEventListener('click', () => {
    currentHistoryPage = 1;
    renderCounts(allHistoryCounts);
  });

  // Página anterior
  prevPageBtn?.addEventListener('click', () => {
    if (currentHistoryPage > 1) {
      currentHistoryPage--;
      renderCounts(allHistoryCounts);
    }
  });

  // Página siguiente
  nextPageBtn?.addEventListener('click', () => {
    const totalPages = Math.ceil(totalHistoryRows / historyRowsPerPage);
    if (currentHistoryPage < totalPages) {
      currentHistoryPage++;
      renderCounts(allHistoryCounts);
    }
  });

  // Última página
  lastPageBtn?.addEventListener('click', () => {
    const totalPages = Math.ceil(totalHistoryRows / historyRowsPerPage);
    currentHistoryPage = totalPages;
    renderCounts(allHistoryCounts);
  });

  // Add press visual effects to pagination buttons to avoid stuck visuals
  [firstPageBtn, prevPageBtn, nextPageBtn, lastPageBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('mousedown', () => btn.classList.add('active'));
    btn.addEventListener('touchstart', () => btn.classList.add('active'));
    const removeActive = () => btn.classList.remove('active');
    btn.addEventListener('mouseup', removeActive);
    btn.addEventListener('mouseleave', removeActive);
    btn.addEventListener('touchend', removeActive);
    btn.addEventListener('blur', removeActive);
  });
}

function renderAllCounts() {
  getAllCounts()
    .then((counts) => {
      allHistoryCounts = counts.reverse();
      currentHistoryPage = 1;
      renderCounts(allHistoryCounts);
    })
    .catch((error) => {
      console.error("Error al obtener todos los registros:", error);
    });
}

function renderCounts(countsToRender) {
  countsTable.innerHTML = "";
  totalHistoryRows = countsToRender.length;
  
  // Calcular paginación
  let displayCounts = countsToRender;
  let start = 0;
  let end = totalHistoryRows;
  
  if (historyRowsPerPage !== 'all') {
    start = (currentHistoryPage - 1) * historyRowsPerPage;
    end = Math.min(start + historyRowsPerPage, totalHistoryRows);
    displayCounts = countsToRender.slice(start, end);
  }
  
  let total = 0;
  let totalJERValue = 0;
  let totalGastosValue = 0;

  displayCounts.forEach((count) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${count.date}</td>
            <td>${
              count.type === "venta" ? count.value.toLocaleString() : "-"
            }</td>
            <td>${count.type === "venta" ? count.description : "-"}</td>
            <td>${
              count.type === "jer" ? count.value.toLocaleString() : "-"
            }</td>
            <td>${count.type === "jer" ? count.description : "-"}</td>
            <td>${
              count.type === "gastos" ? count.value.toLocaleString() : "-"
            }</td>
            <td>${count.type === "gastos" ? count.description : "-"}</td>
            <td class="delete" onclick="deleteId(${count.id})" >Eliminar</td>
        `;
    countsTable.appendChild(tr);
  });

  // Calcular totales de TODOS los registros (no solo los mostrados)
  countsToRender.forEach((count) => {
    if (count.type === "venta") {
      total += parseFloat(count.value);
    } else if (count.type === "jer") {
      totalJERValue += parseFloat(count.value);
    } else if (count.type === "gastos") {
      totalGastosValue += parseFloat(count.value);
    }
  });

  totalVenta.innerHTML = `$${total.toLocaleString()}`;
  totalJER.innerHTML = `$${totalJERValue.toLocaleString()}`;
  totalGastos.innerHTML = `$${totalGastosValue.toLocaleString()}`;
  
  // Calcular y mostrar balance neto
  const balance = total - totalGastosValue;
  const totalBalanceEl = document.getElementById('totalBalance');
  if (totalBalanceEl) {
    totalBalanceEl.innerHTML = `$${balance.toLocaleString()}`;
    totalBalanceEl.style.color = balance >= 0 ? 'var(--success)' : 'var(--danger)';
  }
  
  updateHistoryPaginationInfo(start + 1, end, totalHistoryRows);
  updateHistoryPaginationButtons();
}

function updateHistoryPaginationInfo(start, end, total) {
  const tableInfo = document.getElementById('historyTableInfo');
  const currentPageSpan = document.getElementById('historyCurrentPage');
  const totalPagesSpan = document.getElementById('historyTotalPages');
  
  if (!tableInfo) return;
  
  if (total === 0) {
    tableInfo.textContent = 'No hay registros para mostrar';
    if (currentPageSpan) currentPageSpan.textContent = '0';
    if (totalPagesSpan) totalPagesSpan.textContent = '0';
  } else {
    tableInfo.textContent = `Mostrando ${start} a ${end} de ${total} registros`;
    
    if (historyRowsPerPage === 'all') {
      if (currentPageSpan) currentPageSpan.textContent = '1';
      if (totalPagesSpan) totalPagesSpan.textContent = '1';
    } else {
      const totalPages = Math.ceil(total / historyRowsPerPage);
      if (currentPageSpan) currentPageSpan.textContent = currentHistoryPage;
      if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
    }
  }
}

function updateHistoryPaginationButtons() {
  const firstPageBtn = document.getElementById('historyFirstPage');
  const prevPageBtn = document.getElementById('historyPrevPage');
  const nextPageBtn = document.getElementById('historyNextPage');
  const lastPageBtn = document.getElementById('historyLastPage');
  const paginationDiv = document.getElementById('historyPagination');
  
  if (!paginationDiv) return;
  
  if (historyRowsPerPage === 'all' || totalHistoryRows === 0) {
    paginationDiv.style.display = 'none';
    return;
  }
  
  paginationDiv.style.display = 'flex';
  const totalPages = Math.ceil(totalHistoryRows / historyRowsPerPage);
  
  // Deshabilitar botones según la página actual
  if (firstPageBtn) firstPageBtn.disabled = currentHistoryPage === 1;
  if (prevPageBtn) prevPageBtn.disabled = currentHistoryPage === 1;
  if (nextPageBtn) nextPageBtn.disabled = currentHistoryPage === totalPages;
  if (lastPageBtn) lastPageBtn.disabled = currentHistoryPage === totalPages;

  // Ensure aria-disabled and remove any stuck active class
  [firstPageBtn, prevPageBtn, nextPageBtn, lastPageBtn].forEach((btn) => {
    if (!btn) return;
    if (btn.disabled) {
      btn.setAttribute('aria-disabled', 'true');
      btn.classList.remove('active');
    } else {
      btn.setAttribute('aria-disabled', 'false');
    }
  });
}

btnSearch.addEventListener("click", (event) => {
  event.preventDefault();

  const selectedDate = new Date(dataMonthSearch.value + "-01T00:00:00");
  const selectedMonth = selectedDate.getMonth() + 1;
  const selectedYear = selectedDate.getFullYear();

  getCountsByMonth(selectedYear, selectedMonth)
    .then((filteredCounts) => {
      allHistoryCounts = filteredCounts.reverse();
      if (allHistoryCounts.length === 0) {
        messageResultNoData.style = "display: block";
        messageResultData.style = "display: none";
      }
      if (allHistoryCounts.length !== 0) {
        messageResultNoData.style = "display: none";
        messageResultData.style = "display: block";
      }
      currentHistoryPage = 1;
      renderCounts(allHistoryCounts);
    })
    .catch((error) => {
      console.error("Error al buscar por mes:", error);
    });
});

btnSearchDay.addEventListener("click", (event) => {
  event.preventDefault();

  const selectedDate = dataDaySearch.value;

  getCountsByDay(selectedDate)
    .then((filteredCounts) => {
      allHistoryCounts = filteredCounts.reverse();
      if (allHistoryCounts.length === 0) {
        messageResultNoData.style = "display: block";
        messageResultData.style = "display: none";
      }
      if (allHistoryCounts.length !== 0) {
        messageResultNoData.style = "display: none";
        messageResultData.style = "display: block";
      }
      currentHistoryPage = 1;
      renderCounts(allHistoryCounts);
    })
    .catch((error) => {
      console.error("Error al buscar por día:", error);
    });
});

btnSearchYear.addEventListener("click", (event) => {
  event.preventDefault();

  const selectedYear = dateYearSearch.value;

  getCountsByYear(selectedYear)
    .then((filteredCounts) => {
      allHistoryCounts = filteredCounts.reverse();
      if (allHistoryCounts.length === 0) {
        messageResultNoData.style = "display: block";
        messageResultData.style = "display: none";
      }
      if (allHistoryCounts.length !== 0) {
        messageResultNoData.style = "display: none";
        messageResultData.style = "display: block";
      }
      currentHistoryPage = 1;
      renderCounts(allHistoryCounts);
    })
    .catch((error) => {
      console.error("Error al buscar por año:", error);
    });
});

function deleteId(id) {
  // Usar nuevo sistema de modal si está disponible
  if (typeof modal !== 'undefined') {
    modal.delete(
      'Esta acción eliminará permanentemente este registro. No se puede deshacer.',
      '¿Eliminar registro?'
    ).then((confirmed) => {
      if (confirmed) {
        deleteCount(id)
          .then(() => {
            renderAllCounts();
            
            if (typeof toast !== 'undefined') {
              toast.success('El registro se eliminó correctamente', '¡Eliminado!', 3000);
            } else {
              showToast('¡Eliminado!', 'El registro se eliminó correctamente.', 'success');
            }
          })
          .catch((error) => {
            console.error("Error al eliminar el registro:", error);
            if (typeof toast !== 'undefined') {
              toast.error('No se pudo eliminar el registro', 'Error', 4000);
            } else {
              showToast('Error', 'No se pudo eliminar el registro.', 'error');
            }
          });
      }
    });
  } else {
    // Fallback al sistema antiguo
    showConfirmModal({
      title: '¿Eliminar registro?',
      message: 'Esta acción eliminará permanentemente este registro. No se puede deshacer.',
      type: 'danger',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        deleteCount(id)
          .then(() => {
            renderAllCounts();
            showToast('¡Eliminado!', 'El registro se eliminó correctamente.', 'success');
          })
          .catch((error) => {
            console.error("Error al eliminar el registro:", error);
            showToast('Error', 'No se pudo eliminar el registro.', 'error');
          });
      }
    });
  }
}

// ====== FUNCIONALIDAD DE FILTROS AVANZADOS ======

// Toggle panel de filtros
const btnFilterToggle = document.getElementById('btnFilterToggle');
const filtersPanel = document.getElementById('filtersPanel');

if (btnFilterToggle && filtersPanel) {
  btnFilterToggle.addEventListener('click', () => {
    filtersPanel.classList.toggle('hidden');
    const isHidden = filtersPanel.classList.contains('hidden');
    btnFilterToggle.innerHTML = `
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
      </svg>
      ${isHidden ? 'Mostrar Filtros' : 'Ocultar Filtros'}
    `;
  });
}

// Filtro por tipo de operación en tiempo real
const filterType = document.getElementById('filterType');
if (filterType) {
  filterType.addEventListener('change', applyFilters);
}

// Filtro de búsqueda en descripción en tiempo real
const filterSearch = document.getElementById('filterSearch');
if (filterSearch) {
  let searchTimeout;
  filterSearch.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 300);
  });
}

// Filtros de monto
const filterMinAmount = document.getElementById('filterMinAmount');
const filterMaxAmount = document.getElementById('filterMaxAmount');
if (filterMinAmount) filterMinAmount.addEventListener('change', applyFilters);
if (filterMaxAmount) filterMaxAmount.addEventListener('change', applyFilters);

// Botón aplicar filtros
const btnApplyFilters = document.getElementById('btnApplyFilters');
if (btnApplyFilters) {
  btnApplyFilters.addEventListener('click', applyFilters);
}

// Botón resetear filtros
const btnResetFilters = document.getElementById('btnResetFilters');
if (btnResetFilters) {
  btnResetFilters.addEventListener('click', () => {
    // Resetear todos los campos de filtro
    if (filterType) filterType.value = 'all';
    if (filterSearch) filterSearch.value = '';
    if (filterMinAmount) filterMinAmount.value = '';
    if (filterMaxAmount) filterMaxAmount.value = '';
    if (dataDaySearch) dataDaySearch.value = '';
    if (dataMonthSearch) dataMonthSearch.value = '';
    if (dateYearSearch) dateYearSearch.value = '';
    
    // Volver a cargar todos los registros
    renderAllCounts();
    
    if (typeof showToast !== 'undefined') {
      showToast('Filtros limpiados', 'Mostrando todos los registros.', 'info', 2000);
    }
  });
}

function applyFilters() {
  let filteredCounts = [...allHistoryCounts];
  
  // Filtro por tipo
  const typeValue = filterType?.value;
  if (typeValue && typeValue !== 'all') {
    filteredCounts = filteredCounts.filter(count => count.type === typeValue);
  }
  
  // Filtro por búsqueda en descripción
  const searchValue = filterSearch?.value.toLowerCase().trim();
  if (searchValue) {
    filteredCounts = filteredCounts.filter(count => 
      count.description.toLowerCase().includes(searchValue)
    );
  }
  
  // Filtro por monto mínimo
  const minAmount = filterMinAmount?.value;
  if (minAmount && !isNaN(minAmount) && parseFloat(minAmount) > 0) {
    filteredCounts = filteredCounts.filter(count => 
      parseFloat(count.value) >= parseFloat(minAmount)
    );
  }
  
  // Filtro por monto máximo
  const maxAmount = filterMaxAmount?.value;
  if (maxAmount && !isNaN(maxAmount) && parseFloat(maxAmount) > 0) {
    filteredCounts = filteredCounts.filter(count => 
      parseFloat(count.value) <= parseFloat(maxAmount)
    );
  }
  
  // Mostrar/ocultar mensaje de no hay datos
  if (filteredCounts.length === 0) {
    messageResultNoData.style = "display: flex";
    messageResultData.style = "display: none";
  } else {
    messageResultNoData.style = "display: none";
    messageResultData.style = "display: grid";
  }
  
  currentHistoryPage = 1;
  renderCounts(filteredCounts);
}

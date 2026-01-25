const dateNowUTC = new Date();
const dateNowLocal = new Date(dateNowUTC.getTime() - 5 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];
  const dataDaySearch = dateNowLocal;
const countsTable = document.getElementById("counts");
const messageResultNoData = document.querySelector(".messageResultNoData");
const messageResultData = document.querySelector(".messageResultData");
let totalVenta = document.getElementById("totalVenta");
let totalJER = document.getElementById("totalJER");
let totalGastos = document.getElementById("totalGastos");

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

  // Cambiar filas por página
  if (rowsPerPageSelect) {
    // Inicializar con el valor actual del select si existe
    historyRowsPerPage = rowsPerPageSelect.value === 'all' ? 'all' : parseInt(rowsPerPageSelect.value);
    rowsPerPageSelect.addEventListener('change', (e) => {
      historyRowsPerPage = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
      currentHistoryPage = 1;
      renderCounts(allHistoryCounts);
    });
  }

  // Primera página
  firstPageBtn.addEventListener('click', () => {
    currentHistoryPage = 1;
    renderCounts(allHistoryCounts);
  });

  // Página anterior
  prevPageBtn.addEventListener('click', () => {
    if (currentHistoryPage > 1) {
      currentHistoryPage--;
      renderCounts(allHistoryCounts);
    }
  });

  // Página siguiente
  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(totalHistoryRows / historyRowsPerPage);
    if (currentHistoryPage < totalPages) {
      currentHistoryPage++;
      renderCounts(allHistoryCounts);
    }
  });

  // Última página
  lastPageBtn.addEventListener('click', () => {
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
  const selectedDate = dataDaySearch;

  getCountsByDay(selectedDate)
    .then((filteredCounts) => {
      if (filteredCounts.length === 0) {
        messageResultNoData.style = "display: block";
        messageResultData.style = "display: none";
      }
      if (filteredCounts.length !== 0) {
        messageResultNoData.style = "display: none";
        messageResultData.style = "display: block";
      }
      renderCounts(filteredCounts.reverse());
    })
    .catch((error) => {
      console.error("Error al buscar por día:", error);
    });
}

function renderAllCounts() {
  const selectedDate = dataDaySearch;

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
  
  updateHistoryPaginationInfo(start + 1, end, totalHistoryRows);
  updateHistoryPaginationButtons();
}

function updateHistoryPaginationInfo(start, end, total) {
  const tableInfo = document.getElementById('historyTableInfo');
  const currentPageSpan = document.getElementById('historyCurrentPage');
  const totalPagesSpan = document.getElementById('historyTotalPages');
  
  if (total === 0) {
    tableInfo.textContent = 'No hay registros para mostrar';
    currentPageSpan.textContent = '0';
    totalPagesSpan.textContent = '0';
  } else {
    tableInfo.textContent = `Mostrando ${start} a ${end} de ${total} registros`;
    
    if (historyRowsPerPage === 'all') {
      currentPageSpan.textContent = '1';
      totalPagesSpan.textContent = '1';
    } else {
      const totalPages = Math.ceil(total / historyRowsPerPage);
      currentPageSpan.textContent = currentHistoryPage;
      totalPagesSpan.textContent = totalPages;
    }
  }
}

function updateHistoryPaginationButtons() {
  const firstPageBtn = document.getElementById('historyFirstPage');
  const prevPageBtn = document.getElementById('historyPrevPage');
  const nextPageBtn = document.getElementById('historyNextPage');
  const lastPageBtn = document.getElementById('historyLastPage');
  const paginationDiv = document.getElementById('historyPagination');
  
  if (historyRowsPerPage === 'all' || totalHistoryRows === 0) {
    paginationDiv.style.display = 'none';
    return;
  }
  
  paginationDiv.style.display = 'flex';
  const totalPages = Math.ceil(totalHistoryRows / historyRowsPerPage);
  
  // Deshabilitar botones según la página actual
  firstPageBtn.disabled = currentHistoryPage === 1;
  prevPageBtn.disabled = currentHistoryPage === 1;
  nextPageBtn.disabled = currentHistoryPage === totalPages;
  lastPageBtn.disabled = currentHistoryPage === totalPages;

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

const btnSearchDay = document.getElementById("btnSearchDay");
if (btnSearchDay) {
  btnSearchDay.addEventListener("click", (event) => {
    event.preventDefault();

    const selectedDate = dataDaySearch;

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
}

function deleteId(id) {
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

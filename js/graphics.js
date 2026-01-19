// ====================================
// ESTADO GLOBAL Y VARIABLES
// ====================================
let allData = [];
let filteredData = [];
let charts = {
  trend: null,
  distribution: null,
  monthlyComparison: null,
  weekly: null
};

// Variables de paginación
let currentPage = 1;
let rowsPerPage = 10;
let totalRows = 0;

// ====================================
// INICIALIZACIÓN
// ====================================
document.addEventListener("DOMContentLoaded", () => {
  initDB()
    .then(() => {
      setupFilters();
      loadData();
    })
    .catch((error) => {
      console.error("Error al inicializar la base de datos:", error);
      showError("No se pudo inicializar la base de datos");
    });
});

// ====================================
// CONFIGURACIÓN DE FILTROS
// ====================================
function setupFilters() {
  const filterPeriod = document.getElementById('filterPeriod');
  const filterYear = document.getElementById('filterYear');
  const applyBtn = document.getElementById('applyFilters');
  const resetBtn = document.getElementById('resetFilters');
  const trendChartType = document.getElementById('trendChartType');
  const customRangeGroup = document.getElementById('customRangeGroup');
  const customRangeToGroup = document.getElementById('customRangeToGroup');

  // Populate years
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= currentYear - 5; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    if (year === currentYear) option.selected = true;
    filterYear.appendChild(option);
  }

  // Show/hide custom range
  filterPeriod.addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
      customRangeGroup.style.display = 'block';
      customRangeToGroup.style.display = 'block';
    } else {
      customRangeGroup.style.display = 'none';
      customRangeToGroup.style.display = 'none';
    }
  });

  // Apply filters
  applyBtn.addEventListener('click', () => {
    applyFilters();
  });

  // Reset filters
  resetBtn.addEventListener('click', () => {
    filterPeriod.value = 'month';
    filterYear.value = currentYear;
    document.getElementById('filterMonth').value = 'all';
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    customRangeGroup.style.display = 'none';
    customRangeToGroup.style.display = 'none';
    applyFilters();
  });

  // Change chart type
  trendChartType.addEventListener('change', (e) => {
    updateTrendChart(e.target.value);
  });

  // Configurar paginación
  setupPagination();
}

function setupPagination() {
  const rowsPerPageSelect = document.getElementById('rowsPerPage');
  const firstPageBtn = document.getElementById('firstPage');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const lastPageBtn = document.getElementById('lastPage');

  // Cambiar filas por página
  rowsPerPageSelect.addEventListener('change', (e) => {
    rowsPerPage = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
    currentPage = 1;
    updateSummaryTable();
  });

  // Primera página
  firstPageBtn.addEventListener('click', () => {
    currentPage = 1;
    updateSummaryTable();
  });

  // Página anterior
  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updateSummaryTable();
    }
  });

  // Página siguiente
  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updateSummaryTable();
    }
  });

  // Última página
  lastPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    currentPage = totalPages;
    updateSummaryTable();
  });
}

// ====================================
// CARGA DE DATOS
// ====================================
function loadData() {
  getAllCounts()
    .then((data) => {
      allData = data;
      applyFilters();
    })
    .catch((error) => {
      console.error("Error al obtener los datos:", error);
      showError("No se pudieron cargar los datos");
    });
}

// ====================================
// APLICAR FILTROS
// ====================================
function applyFilters() {
  const period = document.getElementById('filterPeriod').value;
  const year = document.getElementById('filterYear').value;
  const month = document.getElementById('filterMonth').value;
  const dateFrom = document.getElementById('dateFrom').value;
  const dateTo = document.getElementById('dateTo').value;

  let filtered = [...allData];
  const now = new Date();

  // Filter by period
  if (period === 'today') {
    const today = now.toISOString().split('T')[0];
    filtered = filtered.filter(item => item.date === today);
  } else if (period === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter(item => new Date(item.date) >= weekAgo);
  } else if (period === 'month') {
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
    filtered = filtered.filter(item => new Date(item.date) >= monthAgo);
  } else if (period === 'year') {
    const yearStart = new Date(now.getFullYear(), 0, 1);
    filtered = filtered.filter(item => new Date(item.date) >= yearStart);
  } else if (period === 'custom' && dateFrom && dateTo) {
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= new Date(dateFrom) && itemDate <= new Date(dateTo);
    });
  }

  // Filter by year
  if (year !== 'all') {
    filtered = filtered.filter(item => {
      return new Date(item.date).getFullYear() === parseInt(year);
    });
  }

  // Filter by month
  if (month !== 'all') {
    filtered = filtered.filter(item => {
      return new Date(item.date).getMonth() === parseInt(month);
    });
  }

  filteredData = filtered;
  updateDashboard();
}

// ====================================
// ACTUALIZAR DASHBOARD
// ====================================
function updateDashboard() {
  updateKPIs();
  updateCharts();
  updateSummaryTable();
}

// ====================================
// ACTUALIZAR KPIs
// ====================================
function updateKPIs() {
  const stats = calculateStats(filteredData);
  const prevStats = calculatePreviousPeriodStats();

  // Total Sales
  document.getElementById('kpiTotalSales').textContent = formatCurrency(stats.totalSales);
  updateChangeIndicator('kpiSalesChange', stats.totalSales, prevStats.totalSales);

  // Total Jer
  document.getElementById('kpiTotalJer').textContent = formatCurrency(stats.totalJer);
  updateChangeIndicator('kpiJerChange', stats.totalJer, prevStats.totalJer);

  // Total Expenses
  document.getElementById('kpiTotalExpenses').textContent = formatCurrency(stats.totalExpenses);
  updateChangeIndicator('kpiExpensesChange', stats.totalExpenses, prevStats.totalExpenses, true);

  // Net Profit
  const netProfit = stats.totalSales + stats.totalJer - stats.totalExpenses;
  const prevNetProfit = prevStats.totalSales + prevStats.totalJer - prevStats.totalExpenses;
  document.getElementById('kpiNetProfit').textContent = formatCurrency(netProfit);
  updateChangeIndicator('kpiProfitChange', netProfit, prevNetProfit);

  // Margin
  const margin = stats.totalSales > 0 ? ((netProfit / stats.totalSales) * 100) : 0;
  const prevMargin = prevStats.totalSales > 0 ? ((prevNetProfit / prevStats.totalSales) * 100) : 0;
  document.getElementById('kpiMargin').textContent = margin.toFixed(1) + '%';
  updateChangeIndicator('kpiMarginChange', margin, prevMargin);

  // Average Daily
  const days = getUniqueDays(filteredData).length || 1;
  const avgDaily = (stats.totalSales + stats.totalJer) / days;
  const prevDays = getUniqueDays(getPreviousPeriodData()).length || 1;
  const prevAvgDaily = (prevStats.totalSales + prevStats.totalJer) / prevDays;
  document.getElementById('kpiAvgDaily').textContent = formatCurrency(avgDaily);
  updateChangeIndicator('kpiAvgChange', avgDaily, prevAvgDaily);
}

function calculateStats(data) {
  return data.reduce((acc, item) => {
    if (item.type === 'venta') acc.totalSales += item.value;
    else if (item.type === 'jer') acc.totalJer += item.value;
    else if (item.type === 'gastos') acc.totalExpenses += item.value;
    return acc;
  }, { totalSales: 0, totalJer: 0, totalExpenses: 0 });
}

function calculatePreviousPeriodStats() {
  const prevData = getPreviousPeriodData();
  return calculateStats(prevData);
}

function getPreviousPeriodData() {
  if (filteredData.length === 0) return [];
  
  const dates = filteredData.map(item => new Date(item.date));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const periodLength = maxDate - minDate;
  
  const prevStart = new Date(minDate.getTime() - periodLength);
  const prevEnd = minDate;
  
  return allData.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= prevStart && itemDate < prevEnd;
  });
}

function getUniqueDays(data) {
  const uniqueDates = new Set(data.map(item => item.date));
  return Array.from(uniqueDates);
}

function updateChangeIndicator(elementId, current, previous, inverse = false) {
  const element = document.getElementById(elementId);
  if (previous === 0) {
    element.textContent = '-';
    element.className = 'kpi-change';
    return;
  }
  
  const change = ((current - previous) / previous) * 100;
  const isPositive = inverse ? change < 0 : change > 0;
  
  element.textContent = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  element.className = `kpi-change ${isPositive ? 'positive' : 'negative'}`;
}

// ====================================
// ACTUALIZAR GRÁFICOS
// ====================================
function updateCharts() {
  renderTrendChart();
  renderDistributionChart();
  renderMonthlyComparisonChart();
  renderWeeklyChart();
}

function renderTrendChart(type = 'line') {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const groupedData = groupDataByDate(filteredData);
  
  const labels = Object.keys(groupedData).sort();
  const salesData = labels.map(date => groupedData[date].venta);
  const jerData = labels.map(date => groupedData[date].jer);
  const expensesData = labels.map(date => groupedData[date].gastos);
  
  if (charts.trend) charts.trend.destroy();
  
  charts.trend = new Chart(ctx, {
    type: type,
    data: {
      labels: labels.map(date => formatDateLabel(date)),
      datasets: [
        {
          label: 'Ventas',
          data: salesData,
          backgroundColor: 'rgba(13, 148, 136, 0.2)',
          borderColor: 'rgba(13, 148, 136, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: type === 'line'
        },
        {
          label: 'Jer',
          data: jerData,
          backgroundColor: 'rgba(8, 145, 178, 0.2)',
          borderColor: 'rgba(8, 145, 178, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: type === 'line'
        },
        {
          label: 'Gastos',
          data: expensesData,
          backgroundColor: 'rgba(220, 38, 38, 0.2)',
          borderColor: 'rgba(220, 38, 38, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: type === 'line'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      }
    }
  });
}

function renderDistributionChart() {
  const canvas = document.getElementById('distributionChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const stats = calculateStats(filteredData);
  
  if (charts.distribution) charts.distribution.destroy();
  
  charts.distribution = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Ventas', 'Jer', 'Gastos'],
      datasets: [{
        data: [stats.totalSales, stats.totalJer, stats.totalExpenses],
        backgroundColor: [
          'rgba(13, 148, 136, 0.8)',
          'rgba(8, 145, 178, 0.8)',
          'rgba(220, 38, 38, 0.8)'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = formatCurrency(context.parsed);
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function renderMonthlyComparisonChart() {
  const canvas = document.getElementById('monthlyComparisonChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const monthlyData = groupDataByMonth(filteredData);
  
  const labels = Object.keys(monthlyData).map(key => {
    const [year, month] = key.split('-');
    return `${getMonthName(parseInt(month))} ${year}`;
  });
  
  const netProfits = Object.values(monthlyData).map(data => 
    data.venta + data.jer - data.gastos
  );
  
  if (charts.monthlyComparison) charts.monthlyComparison.destroy();
  
  charts.monthlyComparison = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Ganancia Neta',
        data: netProfits,
        backgroundColor: netProfits.map(v => 
          v >= 0 ? 'rgba(5, 150, 105, 0.8)' : 'rgba(220, 38, 38, 0.8)'
        ),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return 'Ganancia: ' + formatCurrency(context.parsed.y);
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      }
    }
  });
}

function renderWeeklyChart() {
  const canvas = document.getElementById('weeklyChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const weeklyData = groupDataByWeekday(filteredData);
  
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const labels = dayNames;
  const data = dayNames.map((_, index) => weeklyData[index] || { venta: 0, jer: 0, gastos: 0 });
  
  if (charts.weekly) charts.weekly.destroy();
  
  charts.weekly = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Ventas',
          data: data.map(d => d.venta),
          backgroundColor: 'rgba(13, 148, 136, 0.8)',
        },
        {
          label: 'Jer',
          data: data.map(d => d.jer),
          backgroundColor: 'rgba(8, 145, 178, 0.8)',
        },
        {
          label: 'Gastos',
          data: data.map(d => d.gastos),
          backgroundColor: 'rgba(220, 38, 38, 0.8)',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: false
        },
        x: {
          stacked: false
        }
      }
    }
  });
}

function updateTrendChart(type) {
  renderTrendChart(type);
}

// ====================================
// ACTUALIZAR TABLA DE RESUMEN
// ====================================
function updateSummaryTable() {
  const tbody = document.getElementById('summaryTableBody');
  const monthlyData = groupDataByMonth(filteredData);
  
  if (Object.keys(monthlyData).length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">No hay datos para mostrar</td></tr>';
    updatePaginationInfo(0, 0, 0);
    return;
  }
  
  // Ordenar y preparar datos
  const sortedKeys = Object.keys(monthlyData).sort().reverse();
  totalRows = sortedKeys.length;
  
  // Calcular paginación
  let displayKeys = sortedKeys;
  let start = 0;
  let end = totalRows;
  
  if (rowsPerPage !== 'all') {
    start = (currentPage - 1) * rowsPerPage;
    end = Math.min(start + rowsPerPage, totalRows);
    displayKeys = sortedKeys.slice(start, end);
  }
  
  // Generar filas
  const rows = displayKeys.map(key => {
    const [year, month] = key.split('-');
    const data = monthlyData[key];
    const profit = data.venta + data.jer - data.gastos;
    const margin = data.venta > 0 ? ((profit / data.venta) * 100) : 0;
    
    return `
      <tr>
        <td><strong>${getMonthName(parseInt(month))} ${year}</strong></td>
        <td class="positive">${formatCurrency(data.venta)}</td>
        <td class="info">${formatCurrency(data.jer)}</td>
        <td class="negative">${formatCurrency(data.gastos)}</td>
        <td class="${profit >= 0 ? 'positive' : 'negative'}">${formatCurrency(profit)}</td>
        <td>${margin.toFixed(1)}%</td>
      </tr>
    `;
  }).join('');
  
  tbody.innerHTML = rows;
  updatePaginationInfo(start + 1, end, totalRows);
  updatePaginationButtons();
}

function updatePaginationInfo(start, end, total) {
  const tableInfo = document.getElementById('tableInfo');
  const currentPageSpan = document.getElementById('currentPage');
  const totalPagesSpan = document.getElementById('totalPages');
  
  if (total === 0) {
    tableInfo.textContent = 'No hay registros para mostrar';
    currentPageSpan.textContent = '0';
    totalPagesSpan.textContent = '0';
  } else {
    tableInfo.textContent = `Mostrando ${start} a ${end} de ${total} registros`;
    
    if (rowsPerPage === 'all') {
      currentPageSpan.textContent = '1';
      totalPagesSpan.textContent = '1';
    } else {
      const totalPages = Math.ceil(total / rowsPerPage);
      currentPageSpan.textContent = currentPage;
      totalPagesSpan.textContent = totalPages;
    }
  }
}

function updatePaginationButtons() {
  const firstPageBtn = document.getElementById('firstPage');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const lastPageBtn = document.getElementById('lastPage');
  const paginationDiv = document.getElementById('tablePagination');
  
  if (rowsPerPage === 'all' || totalRows === 0) {
    paginationDiv.style.display = 'none';
    return;
  }
  
  paginationDiv.style.display = 'flex';
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  
  // Deshabilitar botones según la página actual
  firstPageBtn.disabled = currentPage === 1;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
  lastPageBtn.disabled = currentPage === totalPages;
}

// ====================================
// FUNCIONES DE AGRUPACIÓN DE DATOS
// ====================================
function groupDataByDate(data) {
  return data.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = { venta: 0, jer: 0, gastos: 0 };
    }
    acc[item.date][item.type] += item.value;
    return acc;
  }, {});
}

function groupDataByMonth(data) {
  return data.reduce((acc, item) => {
    const date = new Date(item.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!acc[key]) {
      acc[key] = { venta: 0, jer: 0, gastos: 0 };
    }
    acc[key][item.type] += item.value;
    return acc;
  }, {});
}

function groupDataByWeekday(data) {
  return data.reduce((acc, item) => {
    const date = new Date(item.date);
    const day = date.getDay();
    if (!acc[day]) {
      acc[day] = { venta: 0, jer: 0, gastos: 0 };
    }
    acc[day][item.type] += item.value;
    return acc;
  }, {});
}

// ====================================
// FUNCIONES DE UTILIDAD
// ====================================
function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth();
  return `${day} ${getMonthName(month).substring(0, 3)}`;
}

function getMonthName(month) {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month];
}

function showError(message) {
  console.error(message);
  // Could implement toast notification here
}

// ====================================
// EXPORTAR DATOS
// ====================================
document.getElementById('exportData')?.addEventListener('click', () => {
  const monthlyData = groupDataByMonth(filteredData);
  let csv = 'Período,Ventas,Jer,Gastos,Ganancia,Margen\n';
  
  Object.keys(monthlyData).sort().forEach(key => {
    const [year, month] = key.split('-');
    const data = monthlyData[key];
    const profit = data.venta + data.jer - data.gastos;
    const margin = data.venta > 0 ? ((profit / data.venta) * 100).toFixed(1) : '0';
    
    csv += `${getMonthName(parseInt(month))} ${year},${data.venta},${data.jer},${data.gastos},${profit},${margin}%\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `estadisticas_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

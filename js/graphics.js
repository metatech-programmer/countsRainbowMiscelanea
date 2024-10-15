// Obtener los contextos de los gráficos
const ctxMonthly = document
  .getElementById("monthlySalesChart")
  .getContext("2d");
const ctxYearly = document.getElementById("yearlySalesChart").getContext("2d");
const ctxWeekly = document.getElementById("weeklySalesChart").getContext("2d");

let monthlyChart, yearlyChart, weeklyChart;

document.addEventListener("DOMContentLoaded", () => {
  initDB()
    .then(() => {
      updateCharts();
    })
    .catch((error) => {
      console.error("Error al inicializar la base de datos:", error);
    });
});

function updateCharts() {
  getAllCounts()
    .then((ventas) => {
      console.log("Datos obtenidos:", ventas);
      const { monthlyData, yearlyData, weeklyData } = processData(ventas);
      console.log("Datos procesados:", { monthlyData, yearlyData, weeklyData });
      renderMonthlyChart(monthlyData);
      renderYearlyChart(yearlyData);
      renderWeeklyChart(weeklyData);
    })
    .catch((error) => {
      console.error("Error al obtener los datos para los gráficos:", error);
    });
}

function processData(ventas) {
  const monthlyData = Array(12)
    .fill()
    .map(() => ({ venta: 0, jer: 0, gastos: 0 }));
  const yearlyData = {};
  const weeklyData = Array(7)
    .fill()
    .map(() => ({ venta: 0, jer: 0, gastos: 0 }));

  ventas.forEach((venta) => {
    const date = new Date(venta.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    const day = date.getDay();

    // Datos mensuales
    monthlyData[month][venta.type] += venta.value;

    // Datos anuales
    if (!yearlyData[year]) {
      yearlyData[year] = { venta: 0, jer: 0, gastos: 0 };
    }
    yearlyData[year][venta.type] += venta.value;

    // Datos semanales
    weeklyData[day][venta.type] += venta.value;
  });

  return { monthlyData, yearlyData, weeklyData };
}

function renderMonthlyChart(monthlyData) {
  const labels = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const datasets = [
    {
      label: "Ventas Mensuales",
      data: monthlyData.map((d) => d.venta),
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
    {
      label: "Jer Mensuales",
      data: monthlyData.map((d) => d.jer),
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
    {
      label: "Gastos Mensuales",
      data: monthlyData.map((d) => d.gastos),
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ];

  if (monthlyChart) {
    monthlyChart.destroy();
  }

  monthlyChart = new Chart(ctxMonthly, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Ventas, Jer y Gastos Mensuales" },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

function renderYearlyChart(yearlyData) {
  const labels = Object.keys(yearlyData);
  const datasets = [
    {
      label: "Ventas Anuales",
      data: labels.map((year) => yearlyData[year].venta),
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
    {
      label: "Jer Anuales",
      data: labels.map((year) => yearlyData[year].jer),
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
    {
      label: "Gastos Anuales",
      data: labels.map((year) => yearlyData[year].gastos),
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ];

  if (yearlyChart) {
    yearlyChart.destroy();
  }

  yearlyChart = new Chart(ctxYearly, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Ventas, Jer y Gastos Anuales" },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

function renderWeeklyChart(weeklyData) {
  const labels = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const datasets = [
    {
      label: "Ventas Semanales",
      data: weeklyData.map((d) => d.venta),
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
    {
      label: "Jer Semanales",
      data: weeklyData.map((d) => d.jer),
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
    {
      label: "Gastos Semanales",
      data: weeklyData.map((d) => d.gastos),
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ];

  if (weeklyChart) {
    weeklyChart.destroy();
  }

  weeklyChart = new Chart(ctxWeekly, {
    type: "bar",
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Ventas, Jer y Gastos Semanales" },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

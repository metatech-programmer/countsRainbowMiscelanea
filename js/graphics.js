const ctxMonthly = document.getElementById('monthlySalesChart').getContext('2d');
const ctxYearly = document.getElementById('yearlySalesChart').getContext('2d');
const ctxWeekly = document.getElementById('weeklySalesChart').getContext('2d');

// Obtener los datos de localStorage
let ventas = JSON.parse(localStorage.getItem("counts")) || [];

// Función para calcular las ventas por mes
function getMonthlyData() {
    const monthlyData = Array(12).fill(0);
    ventas.forEach(venta => {
        const month = new Date(venta.date).getMonth();
        monthlyData[month] += venta.value;
    });
    return monthlyData;
}

// Función para calcular las ventas por año
function getYearlyData() {
    const yearlyData = {};
    ventas.forEach(venta => {
        const year = new Date(venta.date).getFullYear();
        yearlyData[year] = (yearlyData[year] || 0) + venta.value;
    });
    return Object.values(yearlyData);
}

// Función para calcular las ventas por semana
function getWeeklyData() {
    const weeklyData = Array(7).fill(0);
    ventas.forEach(venta => {
        const day = new Date(venta.date).getDay();
        weeklyData[day] += venta.value;
    });
    return weeklyData;
}

// Obtener los datos
const monthlyData = getMonthlyData();
const yearlyData = getYearlyData();
const weeklyData = getWeeklyData();

// Gráfico mensual
const monthlySalesChart = new Chart(ctxMonthly, {
    type: 'pie',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [{
            label: 'Ventas Mensuales',
            data: monthlyData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Ventas Mensuales'
            }
        }
    }
});

// Gráfico anual
const yearlySalesChart = new Chart(ctxYearly, {
    type: 'pie',
    data: {
        labels: Object.keys(yearlyData),
        datasets: [{
            label: 'Ventas Anuales',
            data: yearlyData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Ventas Anuales'
            }
        }
    }
});

// Gráfico semanal
const weeklySalesChart = new Chart(ctxWeekly, {
    type: 'pie',
    data: {
        labels: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        datasets: [{
            label: 'Ventas Semanales',
            data: weeklyData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Ventas Semanales'
            }
        }
    }
});

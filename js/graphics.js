// Obtener los contextos de los gráficos
const ctxMonthly = document.getElementById('monthlySalesChart').getContext('2d');
const ctxYearly = document.getElementById('yearlySalesChart').getContext('2d');
const ctxWeekly = document.getElementById('weeklySalesChart').getContext('2d');

// Obtener los datos de localStorage
let ventas = JSON.parse(localStorage.getItem("counts")) || [];

// Función para clasificar las ventas por tipo
function classifyData() {
    const classified = {
        ventas: ventas.filter(v => v.type === 'venta'),
        jer: ventas.filter(v => v.type === 'jer'),
        gastos: ventas.filter(v => v.type === 'gastos')
    };
    return classified;
}

// Función para calcular las ventas por mes, clasificadas por tipo
function getMonthlyData() {
    const classified = classifyData();
    
    const monthlyVentas = Array(12).fill(0);
    const monthlyJer = Array(12).fill(0);
    const monthlyGastos = Array(12).fill(0);

    classified.ventas.forEach(venta => {
        const month = new Date(venta.date).getMonth();
        if (!isNaN(venta.value)) {
            monthlyVentas[month] += venta.value;
        }
    });

    classified.jer.forEach(jer => {
        const month = new Date(jer.date).getMonth();
        if (!isNaN(jer.value)) {
            monthlyJer[month] += jer.value;
        }
    });

    classified.gastos.forEach(gasto => {
        const month = new Date(gasto.date).getMonth();
        if (!isNaN(gasto.value)) {
            monthlyGastos[month] += gasto.value;
        }
    });

    return { monthlyVentas, monthlyJer, monthlyGastos };
}

// Función para calcular las ventas por año, clasificadas por tipo
function getYearlyData() {
    const classified = classifyData();
    const yearlyData = {
        ventas: {},
        jer: {},
        gastos: {}
    };

    classified.ventas.forEach(venta => {
        const year = new Date(venta.date).getFullYear();
        yearlyData.ventas[year] = (yearlyData.ventas[year] || 0) + venta.value;
    });

    classified.jer.forEach(jer => {
        const year = new Date(jer.date).getFullYear();
        yearlyData.jer[year] = (yearlyData.jer[year] || 0) + jer.value;
    });

    classified.gastos.forEach(gasto => {
        const year = new Date(gasto.date).getFullYear();
        yearlyData.gastos[year] = (yearlyData.gastos[year] || 0) + gasto.value;
    });

    return yearlyData;
}

// Función para calcular las ventas por semana, clasificadas por tipo
function getWeeklyData() {
    const classified = classifyData();
    const weeklyVentas = Array(7).fill(0);
    const weeklyJer = Array(7).fill(0);
    const weeklyGastos = Array(7).fill(0);

    classified.ventas.forEach(venta => {
        const day = new Date(venta.date).getDay();
        weeklyVentas[day] += venta.value;
    });

    classified.jer.forEach(jer => {
        const day = new Date(jer.date).getDay();
        weeklyJer[day] += jer.value;
    });

    classified.gastos.forEach(gasto => {
        const day = new Date(gasto.date).getDay();
        weeklyGastos[day] += gasto.value;
    });

    return { weeklyVentas, weeklyJer, weeklyGastos };
}

// Obtener los datos clasificados
const { monthlyVentas, monthlyJer, monthlyGastos } = getMonthlyData();
const yearlyData = getYearlyData();
const yearlyVentas = Object.values(yearlyData.ventas);
const yearlyJer = Object.values(yearlyData.jer);
const yearlyGastos = Object.values(yearlyData.gastos);
const { weeklyVentas, weeklyJer, weeklyGastos } = getWeeklyData();

// Gráfico mensual
const monthlySalesChart = new Chart(ctxMonthly, {
    type: 'bar', // Gráfico de barras
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
            {
                label: 'Ventas Mensuales',
                data: monthlyVentas,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Jer Mensuales',
                data: monthlyJer,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Gastos Mensuales',
                data: monthlyGastos,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Ventas, Jer y Gastos Mensuales' }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// Gráfico anual
const yearlySalesChart = new Chart(ctxYearly, {
    type: 'bar',
    data: {
        labels: Object.keys(yearlyData.ventas),
        datasets: [
            {
                label: 'Ventas Anuales',
                data: yearlyVentas,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Jer Anuales',
                data: yearlyJer,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Gastos Anuales',
                data: yearlyGastos,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Ventas, Jer y Gastos Anuales' }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});

// Gráfico semanal
const weeklySalesChart = new Chart(ctxWeekly, {
    type: 'bar',
    data: {
        labels: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        datasets: [
            {
                label: 'Ventas Semanales',
                data: weeklyVentas,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Jer Semanales',
                data: weeklyJer,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Gastos Semanales',
                data: weeklyGastos,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Ventas, Jer y Gastos Semanales' }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});

function getSalesReport() {
    // Obtener los datos de localStorage
    const data = JSON.parse(localStorage.getItem("counts")) || [];

    // Inicializar objetos para almacenar los datos
    const report = {
        annual: {},
        monthly: {},
        weekly: {}
    };

    const weekStartDate = new Date();
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay() + 1); // Establecer lunes como el inicio de la semana

    // Recorrer los datos
    data.forEach(item => {
        const date = new Date(item.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Ajustar mes para que sea 1-12
        const weekKey = `${year}-${Math.floor(date.getTime() / (1000 * 60 * 60 * 24 * 7))}`; // Generar una clave para la semana

        // Inicializar el objeto de año si no existe
        if (!report.annual[year]) {
            report.annual[year] = { ventas: 0, jer: 0, gastos: 0 };
        }

        // Inicializar el objeto de mes si no existe
        if (!report.monthly[year]) {
            report.monthly[year] = {};
        }
        if (!report.monthly[year][month]) {
            report.monthly[year][month] = { ventas: 0, jer: 0, gastos: 0 };
        }

        // Inicializar el objeto de semana si no existe
        if (!report.weekly[weekKey]) {
            report.weekly[weekKey] = { ventas: 0, jer: 0, gastos: 0 };
        }

        // Sumar los valores correspondientes
        if (item.type === 'venta') {
            report.annual[year].ventas += item.value;
            report.monthly[year][month].ventas += item.value;
            report.weekly[weekKey].ventas += item.value;
        } else if (item.type === 'jer') {
            report.annual[year].jer += item.value;
            report.monthly[year][month].jer += item.value;
            report.weekly[weekKey].jer += item.value;
        } else if (item.type === 'gastos') {
            report.annual[year].gastos += item.value;
            report.monthly[year][month].gastos += item.value;
            report.weekly[weekKey].gastos += item.value;
        }
    });

    // Formatear los datos para un mejor retorno
    return {
        annual: report.annual,
        monthly: report.monthly,
        weekly: report.weekly
    };
}

// Uso de la función
const salesReport = getSalesReport();
console.log(salesReport);

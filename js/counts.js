const dataMonthSearch = document.getElementById("dateMonthSearch");
const countsTable = document.getElementById("counts");
const messageResult = document.getElementById("messageResult");
let totalVenta = document.getElementById("totalVenta");
let totalJER = document.getElementById("totalJER");
let totalGastos = document.getElementById("totalGastos");
const btnSearch = document.getElementById("btnSearch");

const counts = JSON.parse(localStorage.getItem("counts")) || [];

// Función para mostrar todas las cuentas al cargar la página
function renderAllCounts() {
  renderCounts(counts);
}

// Función para filtrar y mostrar las cuentas en la tabla

// Función para filtrar y mostrar las cuentas en la tabla
function renderCounts(countsToRender) {
  countsTable.innerHTML = ""; // Limpiar la tabla
  let total = 0;
  let totalJERValue = 0;
  let totalGastosValue = 0;

  countsToRender.forEach((count) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${count.date}</td>
            <td>${count.type === "venta" ? count.value.toLocaleString() : "-"}</td>
            <td>${count.type === "venta" ? count.description : "-"}</td>
            <td>${count.type === "jer" ? count.value.toLocaleString() : "-"}</td>
            <td>${count.type === "jer" ? count.description : "-"}</td>
            <td>${count.type === "gastos" ? count.value.toLocaleString() : "-"}</td>
            <td>${count.type === "gastos" ? count.description : "-"}</td>
        `;
    countsTable.appendChild(tr);
    if (count.type === "venta") {
      total += parseFloat(count.value);
    } else if (count.type === "jer") {
      totalJERValue += parseFloat(count.value);
    } else if (count.type === "gastos") {
      totalGastosValue += parseFloat(count.value);
    }
  });

  totalVenta.textContent = total.toLocaleString();
  totalJER.textContent = totalJERValue.toLocaleString();
  totalGastos.textContent = totalGastosValue.toLocaleString();
}

// Cargar todas las cuentas al abrir la página
renderAllCounts();

// Filtrar por mes y mostrar las ventas totales
btnSearch.addEventListener("click", (event) => {
  event.preventDefault(); // Evitar la recarga de la página
  const selectedMonth = new Date(dataMonthSearch.value + "-").toLocaleString(
    "default",
    { month: "long", year: "numeric" }
  );
  const filteredCounts = counts.filter((count) => {
    const countDate = new Date(count.date);
    return (
      countDate.toLocaleString("default", {
        month: "long" ,
        year: "numeric",
      }) === selectedMonth
    );
  });
  renderCounts(filteredCounts);
});


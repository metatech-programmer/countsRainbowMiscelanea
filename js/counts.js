const dataMonthSearch = document.getElementById("dateMonthSearch");
const dataDaySearch = document.getElementById("dateDaySearch");
const countsTable = document.getElementById("counts");
const messageResult = document.getElementById("messageResult");
let totalVenta = document.getElementById("totalVenta");
let totalJER = document.getElementById("totalJER");
let totalGastos = document.getElementById("totalGastos");
const btnSearch = document.getElementById("btnSearch");
const btnSearchDay = document.getElementById("btnSearchDay");

const counts = JSON.parse(localStorage.getItem("counts")) || [];

function renderAllCounts() {
  renderCounts(counts);
}

function renderCounts(countsToRender) {
  countsTable.innerHTML = "";
  let total = 0;
  let totalJERValue = 0;
  let totalGastosValue = 0;

  countsToRender.forEach((count) => {
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
            <td onclick="deleteCount(${
              count.id
            })" style="cursor:pointer; color:red; font-weight:bold; background-color:rgba(255, 0, 0, 0.2); text-align:center" >Eliminar</td>
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

btnSearch.addEventListener("click", (event) => {
  event.preventDefault();

  const selectedDate = new Date(dataMonthSearch.value + "-01T00:00:00");
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const filteredCounts = counts.filter((count) => {
    const countDate = new Date(count.date + "T00:00:00");
    const countMonth = countDate.getMonth();
    const countYear = countDate.getFullYear();

    return countMonth === selectedMonth && countYear === selectedYear;
  });

  if (filteredCounts.length === 0) {
    messageResult.textContent = "No hay resultados para este mes.";
  } else {
    messageResult.textContent = "";
  }

  renderCounts(filteredCounts);
});

btnSearchDay.addEventListener("click", (event) => {
  event.preventDefault();

  const selectedDate = dataDaySearch.value; // Ya está en formato YYYY-MM-DD

  const filteredCounts = counts.filter((count) => {
    return count.date === selectedDate; // Comparación directa ya que ambas están en formato YYYY-MM-DD
  });

  if (filteredCounts.length === 0) {
    messageResult.textContent = "No hay resultados para este día.";
  } else {
    messageResult.textContent = "";
  }

  renderCounts(filteredCounts);
});

function deleteCount(id) {
  let confirmDelete = prompt(
    "¿Seguro que quieres borrar el elemento de esta cuenta? Ingresa 'si' para confirmar"
  );

  if (confirmDelete.toLowerCase() === "si") {
    const index = counts.findIndex((count) => count.id === id); // Buscamos por ID
    if (index !== -1) {
      counts.splice(index, 1);
      localStorage.setItem("counts", JSON.stringify(counts));
      renderAllCounts(); // Refrescar la tabla después de borrar
    }
  } else {
    alert("No se borró el elemento");
  }
}

renderAllCounts();

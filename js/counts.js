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

document.addEventListener("DOMContentLoaded", () => {
  initDB()
    .then(() => {
      renderAllCounts();
    })
    .catch((error) => {
      console.error("Error al inicializar la base de datos:", error);
    });
});

function renderAllCounts() {
  getAllCounts()
    .then((counts) => {
      renderCounts(counts);
    })
    .catch((error) => {
      console.error("Error al obtener todos los registros:", error);
    });
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
            <td class="delete" onclick="deleteId(${count.id})" >Eliminar</td>
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

  totalVenta.innerHTML = `$${total.toLocaleString()}`;
  totalJER.innerHTML = `$${totalJERValue.toLocaleString()}`;
  totalGastos.innerHTML = `$${totalGastosValue.toLocaleString()}`;
}

btnSearch.addEventListener("click", (event) => {
  event.preventDefault();

  const selectedDate = new Date(dataMonthSearch.value + "-01T00:00:00");
  const selectedMonth = selectedDate.getMonth() + 1;
  const selectedYear = selectedDate.getFullYear();

  getCountsByMonth(selectedYear, selectedMonth)
    .then((filteredCounts) => {
      if (filteredCounts.length === 0) {
        messageResultNoData.style = "display: block";
        messageResultData.style = "display: none";
      }
      if (filteredCounts.length !== 0) {
        messageResultNoData.style = "display: none";
        messageResultData.style = "display: block";
      }
      renderCounts(filteredCounts);
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
      if (filteredCounts.length === 0) {
        messageResultNoData.style = "display: block";
        messageResultData.style = "display: none";
      }
      if (filteredCounts.length !== 0) {
        messageResultNoData.style = "display: none";
        messageResultData.style = "display: block";
      }
      renderCounts(filteredCounts);
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
      if (filteredCounts.length === 0) {
        messageResultNoData.style = "display: block";
        messageResultData.style = "display: none";
      }
      if (filteredCounts.length !== 0) {
        messageResultNoData.style = "display: none";
        messageResultData.style = "display: block";
      }
      renderCounts(filteredCounts);
    })
    .catch((error) => {
      console.error("Error al buscar por año:", error);
    });
});

function deleteId(id) {
  let confirmDelete = prompt(
    "¿Deseas eliminar este registro? Ingresa 'si' para confirmar."
  );
  if (confirmDelete.toLowerCase() === "si") {
    deleteCount(id)
      .then(() => {
        renderAllCounts();
      })
      .catch((error) => {
        console.error("Error al eliminar el registro:", error);
      });
  } else {
    alert("Operación cancelada.");
  }
}

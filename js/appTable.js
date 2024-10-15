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

btnSearchDay.addEventListener("click", (event) => {
  event.preventDefault();

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
      renderCounts(filteredCounts);
    })
    .catch((error) => {
      console.error("Error al buscar por día:", error);
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

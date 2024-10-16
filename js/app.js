const type = document.getElementById("type");
const value = document.getElementById("value");
const description = document.getElementById("description");
const btnRegister = document.getElementById("btnRegister");
const countRegistros = document.getElementById("countRegistros");
const spanValue = document.getElementById("spanValue");
const btnProx = document.getElementById("btnProx");
const pedidoList = document.querySelector(".pedidoList");
const btncloseList = document.getElementById("closeList");
const pedido = document.getElementById("pedido");
const btnPedido = document.getElementById("btnPedido");
const dateNow = new Date().toLocaleDateString();
const list = JSON.parse(localStorage.getItem("list")) || [];
const lis = document.getElementById("list");
const btnDelete = document.getElementById("btnDelete");

document.addEventListener("DOMContentLoaded", () => {
  initDB()
    .then(() => {
      updateCountRegistros();
    })
    .catch((error) => {
      console.error("Error al inicializar la base de datos:", error);
    });
});

function updateCountRegistros() {
  getAllCounts()
    .then((counts) => {
      countRegistros.innerText = counts.length;
    })
    .catch((error) => {
      console.error("Error al obtener el conteo de registros:", error);
    });
}

function saveVenta() {
  const dateNowUTC = new Date();
  const dateNowLocal = new Date(dateNowUTC.getTime() - 5 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const typeValue = type.value;
  const valueValue = parseFloat(value.value);
  const descriptionValue = String(description.value).toLowerCase();

  if (
    typeValue === "" ||
    isNaN(valueValue) ||
    valueValue <= 0 ||
    descriptionValue === ""
  ) {
    alert(
      "Todos los campos son obligatorios y el valor debe ser un número positivo."
    );
    return;
  }

  const venta = {
    id: Date.now(),
    date: dateNowLocal,
    type: typeValue,
    value: valueValue,
    description: descriptionValue,
  };

  addCount(venta)
    .then(() => {
      updateCountRegistros();
      type.value = "venta";
      value.value = "";
      description.value = "";
      renderAllCounts();
    })
    .catch((error) => {
      console.error("Error al guardar la venta:", error);
      alert("No se pudo guardar la venta. Inténtalo de nuevo.");
    });
}

function updateSpanValue() {
  const valueValue = parseFloat(value.value);
  if (!isNaN(valueValue) && valueValue > 0) {
    spanValue.innerText = valueValue.toLocaleString();
  } else {
    spanValue.innerText = "";
  }
}

function renderList() {
  lis.innerHTML = "";
  list.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    lis.appendChild(li);
  });
}

btnProx.addEventListener("click", () => {
  btnProx.style.display = "none";
  pedidoList.style.display = "block";
});

btncloseList.addEventListener("click", () => {
  btnProx.style.display = "block";
  pedidoList.style.display = "none";
});

btnPedido.addEventListener("click", (e) => {
  if (pedido.value === "") {
    alert("Por favor, ingresa el item a pedir.");
    return;
  }

  const item = pedido.value;
  list.push(item);
  localStorage.setItem("list", JSON.stringify(list));
  pedido.value = "";
  renderList();
});

btnDelete.addEventListener("click", () => {
  let confirmDelete = prompt(
    "¿Deseas eliminar todos los registros? Ingresa 'si' para confirmar."
  );
  if (confirmDelete.toLowerCase() === "si") {
    localStorage.removeItem("list");
    list.length = 0;
    lis.innerHTML = "";
    btncloseList.click();
    renderList();
  }
});

btnRegister.addEventListener("click", (e) => {
  e.preventDefault();
  saveVenta();
});

renderList();

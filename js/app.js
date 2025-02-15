const typeVenta = document.getElementById("venta");
const value = document.getElementById("value");
const description = document.getElementById("description");
const options = document.getElementById("opciones");
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
const btnSendList = document.getElementById("btnSendList");


const listaPapeleriaMiscelanea = localStorage.getItem("papeleriaMiscelaneaLista") || [];


options.append(
  ...listaPapeleriaMiscelanea.map((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.innerText = item;
    return option;
  })
);

document.addEventListener("DOMContentLoaded", () => {
  initDB()
    .then(() => {
      updateCountRegistros();
    })
    .catch((error) => {
      console.error("Error al inicializar la base de datos:", error);
    });
});

renderList();

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

  let type = document.querySelector('input[name="type"]:checked');
  let digitalPago = document.querySelector('input[name="digitalPago"]:checked') || "";
  const dateNowUTC = new Date();
  const dateNowLocal = new Date(dateNowUTC.getTime() - 5 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  let typeValue = type.value;
  let valueValue = parseFloat(value.value);
  let descriptionValue = "";
  if (digitalPago.value === "nequi") {
    descriptionValue = "(nequi) " + String(description.value).toLowerCase()
  } else if (digitalPago.value === "daviplata") {

    descriptionValue = "(daviplata) " + String(description.value).toLowerCase()
  } else {
    descriptionValue = String(description.value).toLowerCase()
  }


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

  if(!listaPapeleriaMiscelanea.includes(descriptionValue)){
    listaPapeleriaMiscelanea.push(descriptionValue);
    localStorage.setItem("papeleriaMiscelaneaLista", JSON.stringify(listaPapeleriaMiscelanea));
  }

  addCount(venta)
    .then(() => {
      updateCountRegistros();
      type.checked = false;
      typeVenta.checked = true;
      value.value = "";
      description.value = "";
      digitalPago.checked = false;
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
    const btnDeletes = document.createElement("div");
    btnDeletes.innerHTML = "X";
    li.style =
      "color: #131313; font-weight: bold; font-size: 1.2rem;cursor: pointer; ";

    li.addEventListener("mouseover", () => {
      li.style =
        "color: #131313; font-weight: bold; font-size: 1.2rem;cursor: pointer; color: red; display:flex; justify-content: space-between;";
      li.appendChild(btnDeletes);
    });

    li.addEventListener("mouseout", () => {
      li.style =
        "color: #131313; font-weight: bold; font-size: 1.2rem;cursor: pointer;";
      li.removeChild(btnDeletes);
    });

    li.addEventListener("click", () => {
      if (prompt("¿Deseas eliminar este item?") === "si") {
        list.splice(list.indexOf(item), 1);
        localStorage.setItem("list", JSON.stringify(list));
        renderList();
      }
    });
    li.innerHTML = item;

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

btnSendList.addEventListener("click", () => {
  if (list.length === 0) {
    alert("Por favor, agrega un ítem a la lista.");
    return;
  }

  const pedido = localStorage.getItem("list");
  const pedidoLista = JSON.parse(pedido);

  if (pedidoLista) {
    const mensaje = pedidoLista
      .map((item) => `🌟 ${item}\n`) // Añadir un emoji atractivo a cada ítem
      .join("");

    const whatsAppApi = "whatsapp://send"; // API correcta
    const grupoId = "3229383988"; // Formato correcto del ID del grupo
    const message = encodeURIComponent(
      `📋 ¡Hola! Aquí está la lista de lo que necesitamos pedir para la próxima semana en la papeleria:\n\n${mensaje}🛒😊`
    );

    // Crear el enlace para abrir WhatsApp
    const url = `${whatsAppApi}?phone=${grupoId}&text=${message}`;

    //  Abrir la app de WhatsApp
    window.location.href = url;

  } else {
    console.error("No hay pedidos en localStorage.");
  }
});

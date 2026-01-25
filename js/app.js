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


const listaPapeleriaMiscelanea =  JSON.parse(localStorage.getItem("papeleriaMiscelaneaLista")) || [];

for (const item of listaPapeleriaMiscelanea) {
  const option = document.createElement("option");
  option.value = item;
  option.innerText = item;
  options.appendChild(option);
}

document.addEventListener("DOMContentLoaded", () => {
  initDB()
    .then(() => {
      updateCountRegistros();
      renderAllCounts();
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
    showToast('Campos incompletos', 'Todos los campos son obligatorios y el valor debe ser un número positivo.', 'warning');
    return;
  }

  const venta = {
    id: Date.now(),
    date: dateNowLocal,
    type: typeValue,
    value: valueValue,
    description: descriptionValue,
  };

  if (!listaPapeleriaMiscelanea.includes(descriptionValue)) {
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
      showToast('¡Registro guardado!', `Venta de $${valueValue.toLocaleString()} registrada exitosamente.`, 'success');
    })
    .catch((error) => {
      console.error("Error al guardar la venta:", error);
      showToast('Error', 'No se pudo guardar la venta. Inténtalo de nuevo.', 'error');
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
  list.forEach((item, index) => {
    const li = document.createElement("li");
    const btnDeletes = document.createElement("span");
    btnDeletes.innerHTML = "✕";
    btnDeletes.style.cssText = "color: var(--danger); font-weight: bold; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: all 0.2s;";
    
    const textSpan = document.createElement("span");
    textSpan.textContent = item;
    textSpan.style.cssText = "flex: 1;";
    
    li.appendChild(textSpan);
    li.appendChild(btnDeletes);
    
    // Evento para eliminar al hacer clic en la X
    btnDeletes.addEventListener("click", (e) => {
      e.stopPropagation();
      showConfirmModal({
        title: 'Eliminar producto',
        message: `¿Deseas eliminar "${item}" de la lista?`,
        type: 'danger',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        onConfirm: () => {
          list.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(list));
          renderList();
          showToast('Producto eliminado', 'El producto se eliminó de la lista correctamente.', 'success');
        }
      });
    });
    
    // Evento para eliminar al hacer clic en todo el item
    li.addEventListener("click", (e) => {
      if (e.target === btnDeletes) return;
      showConfirmModal({
        title: 'Eliminar producto',
        message: `¿Deseas eliminar "${item}" de la lista?`,
        type: 'danger',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        onConfirm: () => {
          list.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(list));
          renderList();
          showToast('Producto eliminado', 'El producto se eliminó de la lista correctamente.', 'success');
        }
      });
    });

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
    showToast('Campo vacío', 'Por favor, ingresa el producto a pedir.', 'warning');
    return;
  }

  const item = pedido.value;
  list.push(item);
  localStorage.setItem("list", JSON.stringify(list));
  pedido.value = "";
  renderList();
  showToast('Producto agregado', `"${item}" se agregó a la lista.`, 'success', 2000);
});

btnDelete.addEventListener("click", () => {
  if (list.length === 0) {
    showToast('Lista vacía', 'No hay productos en la lista para eliminar.', 'info');
    return;
  }
  
  showConfirmModal({
    title: '¿Vaciar lista completa?',
    message: `Esta acción eliminará ${list.length} producto${list.length > 1 ? 's' : ''} de la lista. Esta acción no se puede deshacer.`,
    type: 'danger',
    confirmText: 'Vaciar lista',
    cancelText: 'Cancelar',
    onConfirm: () => {
      localStorage.removeItem("list");
      list.length = 0;
      lis.innerHTML = "";
      btncloseList.click();
      renderList();
      showToast('Lista vaciada', 'Todos los productos fueron eliminados.', 'success');
    }
  });
});

btnRegister.addEventListener("click", (e) => {
  e.preventDefault();

  saveVenta();
});

btnSendList.addEventListener("click", () => {
  if (list.length === 0) {
    showToast('Lista vacía', 'Por favor, agrega productos a la lista antes de enviar.', 'warning');
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

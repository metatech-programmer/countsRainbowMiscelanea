const type = document.getElementById("type");
const value = document.getElementById("value");
const description = document.getElementById("description");
const btnRegister = document.getElementById("btnRegister");
const dateNow = new Date().toLocaleDateString();

let ventas = JSON.parse(localStorage.getItem("counts")) || [];

function saveVenta() {
  const dateNowLocal = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const typeValue = type.value;
  const valueValue = parseFloat(value.value); // Cambiado a parseFloat
  const descriptionValue = description.value;

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
    id: Date.now(), // ID único basado en el tiempo
    date: dateNowLocal,
    type: typeValue,
    value: valueValue,
    description: descriptionValue,
  };

  try {
    ventas.push(venta);
    localStorage.setItem("counts", JSON.stringify(ventas));
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);
    alert("No se pudo guardar la venta. Inténtalo de nuevo.");
  }

  type.value = "";
  value.value = "";
  description.value = "";
}

btnRegister.addEventListener("click", saveVenta);

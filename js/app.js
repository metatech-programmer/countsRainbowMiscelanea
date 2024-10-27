const type = document.querySelector('input[name="type"]:checked');
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

const listaPapeleriaMiscelanea = [
  "abono",
  "pago santiago",
  "pago angie",
  "pago cesar",
  "recarga betplay",
  "recarga movistar",
  "recarga claro",
  "recarga tigo",
  "recarga wom",
  "recarga paquete claro",
  "recarga paquete movistar",
  "recarga paquete tigo",
  "recarga paquete wom",
  "pago recibo agua",
  "pago recibo luz",
  "pago recibo gas",
  "pago recibo internet",
  "pago recibo tigo",
  "pago recibo tv",
  "pago recibo claro",
  "pago recibo movistar",
  "pago recibo wom",
  "chance",
  "chance millonario",
  "astrosol",
  "astroluna",
  "baoloto",
  "baoloto revancha",
  "miloto",
  "abrochadora",
  "acuarela",
  "agenda",
  "agendas diarias",
  "agendas ejecutivas",
  "agendas escolares",
  "agua 5 litros",
  "alfileres",
  "almohadilla para sello",
  "aluminio",
  "anillas para carpetas",
  "antifaz para dormir",
  "arandela",
  "archivador",
  "aretes",
  "argolla de sujeción",
  "astrosol",
  "audífonos",
  "avisos de puerta",
  "banda elástica",
  "barbijo de papel",
  "barrilito de silicona",
  "barras de silicona",
  "baterías AA",
  "baterías AAA",
  "betún para zapatos",
  "bloc de notas",
  "bloc de papel bond",
  "bloc de papel decorativo",
  "bloqueador solar",
  "bolsa de basura",
  "bolsa de papel kraft",
  "bolsa de regalo",
  "bolsa para dulces",
  "bolsas de celofán",
  "bolsas herméticas",
  "bolígrafo",
  "bolígrafos de colores",
  "borrador",
  "broches",
  "brillantina",
  "cable USB",
  "calendario de escritorio",
  "calculadora científica",
  "calculadora escolar",
  "calculadora financiera",
  "carpeta con aros",
  "carpetas clasificadoras",
  "carpetas con broche",
  "carpetas de cartulina",
  "cartón corrugado",
  "cartón piedra",
  "cartulina de colores",
  "cartulinas decorativas",
  "cartulinas estampadas",
  "cartulinas fluorescentes",
  "cauchos para dinero",
  "celofán",
  "cepillo dental",
  "cera para madera",
  "cera para pisos",
  "cera para zapatos",
  "cinta adhesiva",
  "cinta de enmascarar",
  "cinta métrica",
  "cinta pegajosa",
  "cinta reflectiva",
  "cinta transparente",
  "cintas decorativas",
  "clips de oficina",
  "clips de sujetar",
  "cobertor de laptop",
  "colbon",
  "colorante para alimentos",
  "colores de cera",
  "comandera",
  "compás",
  "corrector líquido",
  "corrector en cinta",
  "crepé",
  "creyones",
  "cuerdas para tendedero",
  "cuerda de yute",
  "cuaderno",
  "cuaderno cuadriculado",
  "cuaderno de anillas",
  "cuaderno de dibujo",
  "cuaderno espiral",
  "cuadernos tamaño carta",
  "cuentas para pulseras",
  "cutter",
  "decoración de globos",
  "decoradores de uñas",
  "diademas",
  "diario personal",
  "diseños para scrapbooking",
  "doblador de papel",
  "durex",
  "encendedor de cocina",
  "encuadernadora",
  "engrapadora",
  "ensamble para carpetas",
  "escarapela",
  "escarcha",
  "esfero multicolor",
  "esferos de gel",
  "esferos con punta de metal",
  "esferos de punta fina",
  "esmalte de uñas",
  "esmalte transparente",
  "espejo portátil",
  "estantes organizadores",
  "etiquetas adhesivas",
  "etiquetas para cuadernos",
  "fichas bibliográficas",
  "fichas de colores",
  "fichas numeradas",
  "foamy",
  "folder de cartulina",
  "folders de plástico",
  "fomi decorado",
  "fotocopias a color",
  "ganchos para ropa",
  "ganchos sujetapapeles",
  "ganchos de oficina",
  "gelatina",
  "glicerina",
  "gomas",
  "gomas de borrar",
  "goma eva",
  "grapas",
  "hojas de examen",
  "hojas iris",
  "hojas para plastificar",
  "hojas perforadas",
  "hojas recicladas",
  "hojas tamaño A3",
  "hojas tamaño carta",
  "hojas tamaño oficio",
  "hologramas decorativos",
  "imán decorativo",
  "imanes para nevera",
  "impresiones a color",
  "impresiones en B/N",
  "impresiones en papel bond",
  "indicadores de lectura",
  "juguetes didácticos",
  "juguetes pequeños",
  "juegos de mesa pequeños",
  "juegos de pintura",
  "kits de manualidades",
  "kits de scrapbooking",
  "laminadora",
  "lapicera",
  "lapicero de tinta",
  "lapicero gel",
  "lapiceros de colores",
  "lápiz borrable",
  "lápiz de colores",
  "lápiz mecánico",
  "lápiz negro",
  "lápiz para dibujo técnico",
  "libretas con tapa dura",
  "libretas decoradas",
  "lima de uñas",
  "llaveros personalizados",
  "maquillaje en polvo",
  "marcadores borrables",
  "marcadores de colores",
  "marcadores permanentes",
  "marcadores de pizarra",
  "mascarillas",
  "moños decorativos",
  "moños para regalo",
  "notas adhesivas",
  "notas decorativas",
  "papel acuarela",
  "papel adhesivo",
  "papel autoadhesivo",
  "papel blanco tamaño carta",
  "papel bond",
  "papel brillante",
  "papel carbónico",
  "papel cebolla",
  "papel charol",
  "papel continuo",
  "papel couché",
  "papel crepé",
  "papel de aluminio",
  "papel de enmascarar",
  "papel de regalo",
  "papel de seda",
  "papel decorativo",
  "papel diamante",
  "papel estampado",
  "papel fotográfico",
  "papel kraft",
  "papel lustrillo",
  "papel para impresión",
  "papel pergamino",
  "papel periódico",
  "papel reciclado",
  "papel tisú",
  "papel transparente",
  "papel vegetal",
  "pega escolar",
  "pegante en barra",
  "pegante instantáneo",
  "pegante líquido",
  "películas adhesivas",
  "pinceles de pintura",
  "pintura acrílica",
  "pintura en polvo",
  "pintura facial",
  "pintura para tela",
  "pinturas acuarelables",
  "pinturas de óleo",
  "pinzas para depilar",
  "plastilina",
  "portafolios",
  "portaminas",
  "porta papeles",
  "portarretrato",
  "postales decorativas",
  "precursores de silicona",
  "regla",
  "resaltador",
  "resmas de papel",
  "rotuladores de colores",
  "sacapuntas",
  "sellos de goma",
  "sellos para scrapbooking",
  "separadores de carpeta",
  "sobres con diseño",
  "sobres de burbujas",
  "sobres de cartón",
  "sobres de papel",
  "sobres decorados",
  "stickers",
  "talonario de recibos",
  "tarjetas de agradecimiento",
  "tarjetas de cumpleaños",
  "tarjetas de presentación",
  "tarjetas postales",
  "tarjetas troqueladas",
  "témperas",
  "tijeras",
  "tijeras de seguridad",
  "tijeras decorativas",
  "tinta para impresora",
  "tinta para sello",
  "tiras decorativas",
  "titular de llave",
  "tocadores portátiles",
  "trapero",
  "troqueladoras",
  "velas",
  "vinilo líquido",
  "vinilo para manualidades",
  "watercolors",
  "wasabi tape",
  "alcohol en gel",
  "algodones desmaquillantes",
  "almohadilla ergonómica para mouse",
  "anilina para manualidades",
  "anillos para carpetas",
  "antitranspirante",
  "aroma para ambientador",
  "aspiradora portátil",
  "azúcar en sobres",
  "balas de goma",
  "banda de resistencia",
  "bandas adhesivas",
  "barritas de granola",
  "barra para pegar",
  "base de lápiz",
  "bebidas energéticas",
  "bloques de juguete",
  "botella de aluminio",
  "botella con atomizador",
  "botella para agua",
  "brochas de maquillaje",
  "brochetas de madera",
  "calcomanías para autos",
  "calcomanías de pared",
  "calcomanías para uñas",
  "caja de bombones",
  "caja de cartón",
  "caja de herramientas",
  "caja organizadora",
  "calibre de grosor",
  "calculadora básica",
  "calentador de manos",
  "candelabro",
  "cápsulas de café",
  "carteles de señalización",
  "cartón corrugado",
  "cartulina metalizada",
  "cepillo para cejas",
  "ceras de colores",
  "cerillos",
  "cinta adhesiva decorativa",
  "cinta para el pelo",
  "cinta velcro",
  "cinta washi",
  "clips magnéticos",
  "colgador de llaves",
  "colgador de puerta",
  "colgador de ropa",
  "colgante decorativo",
  "colores pastel",
  "colores para tela",
  "comida para mascotas",
  "concentrado de jugo",
  "conos para palomitas",
  "control remoto universal",
  "cosméticos",
  "cotonetes",
  "crema corporal",
  "crema dental",
  "crema para zapatos",
  "cubo Rubik",
  "cuello térmico",
  "decoración de uñas",
  "difusor de aroma",
  "discos desmaquillantes",
  "dispensador de jabón",
  "dispensador de toallas",
  "diurex decorativo",
  "divisiones para archivo",
  "dona para el cabello",
  "dulces de caramelo",
  "enchufes",
  "engrapadora eléctrica",
  "enjuague bucal",
  "enjuague para ropa",
  "escobilla de baño",
  "escobillón",
  "esfero borrable",
  "esferos con glitter",
  "esferos de gel de colores",
  "esferos recargables",
  "esmalte mate",
  "espejo de bolsillo",
  "espejo para maquillaje",
  "estampas",
  "estante organizador",
  "etiquetas térmicas",
  "exprimidor de jugo",
  "filtros para café",
  "film plástico",
  "foam para manualidades",
  "focos LED",
  "forro de celular",
  "gafas de lectura",
  "gafas de sol",
  "gancho para toallas",
  "gel antibacterial",
  "gel para el cabello",
  "gelatina de frutas",
  "glicerina líquida",
  "gomas de borrar aromáticas",
  "gomas de pelo",
  "gomitas de frutas",
  "gotero de vidrio",
  "grafito para lápiz",
  "guantes de látex",
  "guantes desechables",
  "hilo dental",
  "hojas de alga para sushi",
  "hojas de colores",
  "hojas de lija",
  "hojas para tarjetas",
  "hojas de papel pergamino",
  "hojas de polipropileno",
  "horquillas para cabello",
  "jabón de manos",
  "jabón en barra",
  "jabón líquido",
  "juguete antiestrés",
  "juguetes de madera",
  "juguetes educativos",
  "ketchup en sobres",
  "kit de costura",
  "kit de decoración de uñas",
  "kit de primeros auxilios",
  "kit de repostería",
  "laminadora",
  "lamparita de noche",
  "lápiz de ojos",
  "lápiz de labios",
  "lápiz de mina",
  "lápiz delineador",
  "lápiz pastel",
  "lápices de carbón",
  "libreta para bocetos",
  "libro para colorear",
  "licuadora portátil",
  "lima de vidrio",
  "limpiador multiusos",
  "limpiador para pantalla",
  "linterna pequeña",
  "listón decorativo",
  "loción corporal",
  "maceta pequeña",
  "magnetos para nevera",
  "maletín de herramientas",
  "mantel desechable",
  "mantel individual",
  "marcador borrable magnético",
  "marcadores de borrado en seco",
  "marcadores indelebles",
  "mascara para pestañas",
  "mascarilla facial",
  "máscara para dormir",
  "mini altavoz bluetooth",
  "mini aspiradora",
  "mini botellas para viaje",
  "mini lámpara USB",
  "mini linterna",
  "mini pizarra",
  "mochila escolar",
  "monedero",
  "monitos de goma",
  "mosquitero",
  "mouse inalámbrico",
  "multiport USB",
  "pañales",
  "pañuelos desechables",
  "papel albanene",
  "papel autoadhesivo",
  "papel cebolla",
  "papel de aluminio",
  "papel de china",
  "papel de seda",
  "papel fotográfico",
  "papel kraft",
  "papel para repostería",
  "papel pintado",
  "papel satinado",
  "paquete de baterías",
  "paquete de bombones",
  "paquete de caramelos",
  "paquete de clips",
  "paquete de pegatinas",
  "paraguas portátil",
  "pastillas mentoladas",
  "pegamento blanco",
  "pelador de frutas",
  "pelota antiestrés",
  "peluche pequeño",
  "pendrive",
  "perchas para ropa",
  "piedras decorativas",
  "pincel para maquillaje",
  "pinzas para ropa",
  "plástico burbuja",
  "plato para perro",
  "plumas metálicas",
  "porta cosméticos",
  "porta documentos",
  "porta incienso",
  "portarretrato",
  "postales de regalo",
  "protector solar",
  "puff decorativo",
  "purpurina",
  "quitasmalte",
  "ramas decorativas",
  "rasuradora desechable",
  "ratón ergonómico",
  "refrigerador portátil",
  "repisas para pared",
  "resaltador con forma de flor",
  "retrato en miniatura",
  "rollo de papel reciclado",
  "rollo de vinilo",
  "rompecabezas pequeño",
  "rosas artificiales",
  "rotulador para vidrio",
  "sandalias para baño",
  "sello con diseño",
  "sello para etiquetas",
  "sello personalizado",
  "sellos de letras",
  "serpentinas de colores",
  "servilletas de papel",
  "sobres de azúcar",
  "sobres de crema para café",
  "sobres de mostaza",
  "sobres de pimienta",
  "soporte para celular",
  "soporte para laptop",
  "stickers fluorescentes",
  "tacones decorativos",
  "tapa para refresco",
  "tarjetas de agradecimiento",
  "tarjetas de presentación",
  "tarjetas para regalo",
  "tejido de lana",
  "termómetro digital",
  "termos para café",
  "toallas desinfectantes",
  "toallas húmedas",
  "toberas para pasteles",
  "tobilleras deportivas",
  "toner para piel",
  "tónicos para rostro",
  "toques de decoración",
  "trapitos de cocina",
  "trencitas de tela",
  "troquel de círculos",
  "usb de carga rápida",
  "utensilios de cocina",
  "utensilios de jardinería",
  "vasos con tapa",
  "vasos decorativos",
  "velas aromáticas",
  "velas de cumpleaños",
  "velas flotantes",
  "ventilador portátil",
  "verrugas decorativas",
  "vincha para el cabello",
  "vinchas decorativas",
  "vinilos de pared",
  "vinilo textil",
  "vino en miniatura",
  "yerba mate",
  "yute decorativo",
  "agua panela en polvo",
  "aguapanela en botellas",
  "almojábanas",
  "antibacterial de bolsillo",
  "arequipe",
  "arequipe con brevas",
  "arequipe de cajita",
  "arequipe en tarro",
  "arepitas de maíz",
  "aspirina",
  "bocadillo veleño",
  "bolígrafo Bic",
  "bolsitas plásticas de frutas",
  "bombombunes",
  "borrador Pelikan",
  "borrador lápiz",
  "caramelos de panela",
  "caramelos super coco",
  "cartón paja",
  "cauchos para el cabello",
  "cauchos para el dinero",
  "chancaca",
  "chocolatina Jet",
  "chocolatina Jumbo",
  "chocolatina Mu",
  "chocolatina Sol",
  "chocoramo",
  "chocorramo",
  "chupetas Bom Bom Bum",
  "chupetas Chupetas Colombina",
  "chupetas rellenas",
  "cigarrillos Piel Roja",
  "cocadas",
  "colombinas",
  "copa coqueta",
  "crema dental Colgate",
  "cremosa Vinos de uva",
  "creyones Norma",
  "cuchara plástica",
  "dulce de leche",
  "dulces Gelatina de pata",
  "dulces de café",
  "dulces de leche condensada",
  "empanadas de pipián",
  "encendedores Cricket",
  "fique para barrer",
  "flores decorativas",
  "frunas",
  "galletas Festival",
  "galletas Saltín Noel",
  "gelatina en polvo",
  "guantes de cocina",
  "guantes para moto",
  "guantes quirúrgicos",
  "hojas de examen tamaño oficio",
  "hojas milimetradas",
  "hojuelas de maíz",
  "jabón azul Rey",
  "jabón de baño Johnson’s",
  "jabón líquido Protex",
  "jabón líquido Rexona",
  "jabonera plástica",
  "jugos Hit en bolsa",
  "kit de coser portátil",
  "lapicero Scribe",
  "lapicero rojo Norma",
  "libro de pintar",
  "libretas tamaño bolsillo",
  "lija para madera",
  "lija para uñas",
  "limpión de cocina",
  "manila para documentos",
  "marcador borrable Pelikan",
  "marcador negro BIC",
  "marcador rojo BIC",
  "miel de abejas",
  "minutas escolares",
  "mora en almíbar",
  "moños decorativos",
  "moños para el cabello",
  "muñecos de peluche",
  "nutella",
  "panela molida",
  "panela pulverizada",
  "papel contacto",
  "papel higiénico Familia",
  "papel iris",
  "papel kraft en rollo",
  "papel periódico",
  "papel toalla Scott",
  "pasta dental Sensodyne",
  "pastillas de menta",
  "pastillas de zinc",
  "pañoletas de colores",
  "pegante blanco escolar",
  "pegante líquido Resistol",
  "pegante UHU",
  "peluches en miniatura",
  "periódicos",
  "pintura blanca Vinilo",
  "pintura en polvo",
  "plumones lavables",
  "polos de helado",
  "popetas de maíz",
  "portaminas Pentel",
  "pulseras de mostacillas",
  "quemador de incienso",
  "rayador de queso",
  "regla de 30 cm",
  "resaltadores Stabilo",
  "rotuladores Sharpie",
  "saca corchos",
  "sacapuntas metálico",
  "sacapuntas plásticos",
  "salsa de ajo",
  "salsa de soya",
  "salsas de frutas en sobres",
  "separadores de carpeta Norma",
  "sobres de papel Kraft",
  "solares de papel",
  "sombrillas para el sol",
  "tajalápiz escolar",
  "tapas para envases",
  "tarjetas de agradecimiento",
  "tarjetas de cumpleaños",
  "tarjetas navideñas",
  "tejido de lana",
  "tejidos decorativos",
  "tejpán de colores",
  "tijeras escolares Maped",
  "tijeras decorativas",
  "tiza blanca",
  "tiza de colores",
  "torno para manualidades",
  "tostadas integrales",
  "traperos",
  "tutinas rellenas",
  "vasitos de dulce de leche",
  "vasos plásticos",
  "vinchas para el cabello",
  "vinilo acrílico",
  "vitaminas en polvo",
  "yogurt Alpina",
  "yuca congelada",
  "zapatos de caucho",
  "plantillas",
  "tazas de vidrio",
  "tazas de vidrio de cristal",
  "esmaltes",
  "pinturas",
  "pinceles",
  "pinceles de colores",
  "pinceles de pintura",
  "desodorantes",
  "jabones",
  "jabones liq.",
  "jabones de mano",
  "jabones para el cabello",
  "jabones para el cabello liquido",
  "plastilinas",
  "aseo",
  "dulceria",
  "limpieza",
  "papeleria",
  "miscelanea",
  "tecnologia",
  "piñateria",
  "otros",

];


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
      type.checked = false;
      typeVenta.checked = true;
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

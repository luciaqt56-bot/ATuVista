const track = document.getElementById("screenTrack");
const screens = [...document.querySelectorAll(".screen")];
const dots = [...document.querySelectorAll(".screen-dot")];
const status = document.getElementById("screenStatus");

const prev = document.getElementById("previousScreen");
const next = document.getElementById("nextScreen");

/*Prueba de actualizaciones de git 1*/
let current = 0;
let touchStartX = 0;

// =====================================
// NAVEGACIÓN ENTRE PANTALLAS
// =====================================

function goToScreen(index) {
  current = Math.max(0, Math.min(screens.length - 1, index));

  track.scrollTo({
    left: screens[current].offsetLeft,
    behavior: "smooth"
  });

  updateNavigation();
}

function updateNavigation() {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === current);

    if (i === current) {
      dot.setAttribute("aria-current", "page");
    } else {
      dot.removeAttribute("aria-current");
    }
  });

  status.textContent = `Pantalla ${current + 1} de 3`;
  prev.disabled = current === 0;
  next.disabled = current === screens.length - 1;
}

track.addEventListener("scroll", () => {
  const index = Math.round(track.scrollLeft / track.clientWidth);

  if (index !== current && index >= 0 && index < screens.length) {
    current = index;
    updateNavigation();
  }
}, { passive: true });

prev.addEventListener("click", () => goToScreen(current - 1));
next.addEventListener("click", () => goToScreen(current + 1));

dots.forEach(dot => {
  dot.addEventListener("click", () => {
    goToScreen(Number(dot.dataset.screen));
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "ArrowRight" &&
      !event.target.matches("button, input, textarea")) {
    goToScreen(current + 1);
  }

  if (event.key === "ArrowLeft" &&
      !event.target.matches("button, input, textarea")) {
    goToScreen(current - 1);
  }
});

track.addEventListener("touchstart", event => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

track.addEventListener("touchend", event => {
  const delta = event.changedTouches[0].screenX - touchStartX;

  if (Math.abs(delta) > 55) {
    goToScreen(current + (delta < 0 ? 1 : -1));
  }
}, { passive: true });

updateNavigation();


// =====================================
// LECTURA POR VOZ
// =====================================

function speak(text, panel = null) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 0.88;

  utterance.onstart = () => {
    panel?.classList.add("is-playing");
  };

  utterance.onend = () => {
    panel?.classList.remove("is-playing");
  };

  utterance.onerror = () => {
    panel?.classList.remove("is-playing");
  };

  window.speechSynthesis.speak(utterance);
}

function stopOrSpeak(text, panel = null) {
  if (
    "speechSynthesis" in window &&
    window.speechSynthesis.speaking
  ) {
    window.speechSynthesis.cancel();
    panel?.classList.remove("is-playing");
  } else {
    speak(text, panel);
  }
}


// =====================================
// PANTALLA 1: PRODUCTOS
// =====================================

const productPanel = document.getElementById("productPanel");

document.getElementById("productPlay").addEventListener("click", () => {
  stopOrSpeak(
    "Reconocimiento de productos. La conexión con el reconocimiento de productos se activará al integrar el servicio de la aplicación.",
    productPanel
  );
});


// =====================================
// PANTALLA 2: PERSONAS, PAISAJES Y COLORES
// =====================================

const recognitionPanel = document.getElementById("recognitionPanel");

document.getElementById("recognitionPlay").addEventListener("click", () => {
  stopOrSpeak(
    "Reconocimiento de personas, paisajes y colores. Esta función describirá lo que aparece en la cámara cuando se conecte el servicio de reconocimiento.",
    recognitionPanel
  );
});


// =====================================
// PANTALLA 3: DOCUMENTOS
// Se muestran tres documentos por página.
// =====================================

const documentNames = [
  "Currículum",
  "DNI",
  "Tarjeta sanitaria",
  "Receta médica",
  "Cita médica",
  "Contrato",
  "Informe",
  "Justificante",
  "Otro documento"
];

const documentDescriptions = [
  "Vista previa del currículum. Aquí aparecerá el contenido del documento.",
  "Vista previa del documento de identidad.",
  "Vista previa de la tarjeta sanitaria.",
  "Vista previa de la receta médica.",
  "Vista previa de la cita médica.",
  "Vista previa del contrato.",
  "Vista previa del informe.",
  "Vista previa del justificante.",
  "Vista previa del documento."
];

const documentsPerPage = 3;
let selectedDocument = 0;
let currentDocumentPage = 0;

const grid = document.getElementById("documentGrid");
const gridView = document.getElementById("documentsGridView");
const detailView = document.getElementById("documentDetail");

const counter = document.getElementById("documentCounter");
const previousDocuments = document.getElementById("previousDocuments");
const nextDocument = document.getElementById("nextDocument");


// Dibujar únicamente los tres documentos de la página actual
function renderDocuments() {
  grid.innerHTML = "";

  const start = currentDocumentPage * documentsPerPage;
  const end = Math.min(start + documentsPerPage, documentNames.length);

  for (let index = start; index < end; index++) {
    const tile = document.createElement("button");

    tile.type = "button";
    tile.className = "document-tile";
    tile.dataset.doc = index;
    tile.setAttribute("aria-label", `Documento ${index + 1}: ${documentNames[index]}`);
    tile.setAttribute("aria-pressed", index === selectedDocument ? "true" : "false");

    if (index === selectedDocument) {
      tile.classList.add("selected");
    }

    const icon = document.createElement("span");
    icon.className = "doc-icon";
    icon.textContent = "▤";
    icon.setAttribute("aria-hidden", "true");

    const number = document.createElement("span");
    number.textContent = documentNames[index];

    tile.append(icon, number);

    tile.addEventListener("click", () => {
      selectDocument(index);
      openDocument();
    });

    grid.appendChild(tile);
  }

  counter.textContent = `${start + 1}–${end} de ${documentNames.length}`;

  previousDocuments.disabled = currentDocumentPage === 0;
  nextDocument.disabled = end >= documentNames.length;
}


// Seleccionar documento
function selectDocument(index) {
  selectedDocument = index;

  const page = Math.floor(index / documentsPerPage);

  if (page !== currentDocumentPage) {
    currentDocumentPage = page;
    renderDocuments();
  } else {
    grid.querySelectorAll(".document-tile").forEach(tile => {
      const isSelected = Number(tile.dataset.doc) === index;
      tile.classList.toggle("selected", isSelected);
      tile.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
  }

  document.getElementById("documentName").textContent =
    documentNames[index];

  document.getElementById("documentDescription").textContent =
    documentDescriptions[index];
}


// Abrir vista individual
function openDocument() {
  gridView.hidden = true;
  detailView.hidden = false;
  document.getElementById("documentMic").focus();
}


// Pasar a la siguiente página
nextDocument.addEventListener("click", () => {
  const maxPage = Math.ceil(documentNames.length / documentsPerPage) - 1;

  if (currentDocumentPage < maxPage) {
    currentDocumentPage++;
    selectedDocument = currentDocumentPage * documentsPerPage;
    renderDocuments();
  }
});


// Volver a la página anterior
previousDocuments.addEventListener("click", () => {
  if (currentDocumentPage > 0) {
    currentDocumentPage--;
    selectedDocument = currentDocumentPage * documentsPerPage;
    renderDocuments();
  }
});


// Volver a la cuadrícula
document.getElementById("backToDocuments").addEventListener("click", () => {
  detailView.hidden = true;
  gridView.hidden = false;
  renderDocuments();

  const selectedTile = grid.querySelector(
    `.document-tile[data-doc="${selectedDocument}"]`
  );

  selectedTile?.focus();
});


// Botón Play de documentos
const documentPanel = document.getElementById("documentPanel");

document.getElementById("documentPlay").addEventListener("click", () => {
  stopOrSpeak(
    `Documento ${selectedDocument + 1}. ${documentNames[selectedDocument]}. ${documentDescriptions[selectedDocument]}`,
    documentPanel
  );
});


// Micrófono de la vista individual
document.getElementById("documentMic").addEventListener("click", () => {
  speak(
    `${documentNames[selectedDocument]}. ${documentDescriptions[selectedDocument]} La lectura del documento real se habilitará al conectar el servicio de documentos.`
  );
});


// Primera carga de los documentos
renderDocuments();


// =====================================
// VENTANA DE AYUDA
// =====================================

const helpDialog = document.getElementById("helpDialog");

document.getElementById("helpButton").addEventListener("click", () => {
  helpDialog.showModal();
});

document.getElementById("closeHelp").addEventListener("click", () => {
  helpDialog.close();
});

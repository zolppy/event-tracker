// Utility: Calculate elapsed time between two dates
function calculateElapsed(startDate) {
  const start = new Date(startDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonth;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

// Format date to DD/MM/YYYY
function formatDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

// LocalStorage keys
const STORAGE_KEY = "events";

// Load events from LocalStorage
function loadEvents() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

// Save events to LocalStorage
function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

// Render list
function renderEvents() {
    const list = document.getElementById("event-list");
    list.innerHTML = "";
    const events = loadEvents();
    events.forEach((evt, idx) => {
        const { years, months, days } = calculateElapsed(evt.date);
        const item = document.createElement("div");
        item.className = "glass-card rounded-lg p-4 flex justify-between items-center";
        item.innerHTML = `
            <div>
                <p class="font-bold text-lg text-white">${evt.name}</p>
                <p class="text-sm text-white/80">Início: ${formatDate(evt.date)}</p>
                <p class="text-sm text-white/90 mt-1">Tempo: ${years}a ${months}m ${days}d</p>
            </div>
            <div class="flex space-x-3">
                <button data-action="edit" data-index="${idx}" class="text-white/70 hover:text-white transition-colors">
                    <i class="bi bi-pencil-fill text-lg"></i>
                </button>
                <button data-action="delete" data-index="${idx}" class="text-white/70 hover:text-white transition-colors">
                    <i class="bi bi-trash-fill text-lg"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

// Form Modal
const formModal = document.getElementById("form-modal");
const formModalTitle = document.getElementById("form-modal-title");
const eventForm = document.getElementById("event-form");
const eventNameInput = document.getElementById("event-name");
const eventDateInput = document.getElementById("event-date");
const addEventButton = document.getElementById("add-event-button");
const formCancelButton = document.getElementById("form-cancel");
let editIndex = null;

function showFormModal(index = null) {
  editIndex = index;
  if (index !== null) {
    const events = loadEvents();
    const event = events[index];
    formModalTitle.textContent = "Editar Evento";
    eventNameInput.value = event.name;
    eventDateInput.value = event.date;
  } else {
    formModalTitle.textContent = "Adicionar Evento";
    eventForm.reset();
  }
  formModal.classList.remove("hidden");
}

function hideFormModal() {
  formModal.classList.add("hidden");
  editIndex = null;
  eventForm.reset();
}

addEventButton.addEventListener("click", () => showFormModal());
formCancelButton.addEventListener("click", () => hideFormModal());

eventForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = eventNameInput.value.trim();
  const date = eventDateInput.value;
  if (!name || !date) return;
  const events = loadEvents();
  if (editIndex !== null) {
    events[editIndex] = { name, date };
  } else {
    events.push({ name, date });
  }
  saveEvents(events);
  hideFormModal();
  renderEvents();
});

// Handle edit/delete buttons
document.getElementById("event-list").addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.getAttribute("data-action");
  const idx = parseInt(btn.getAttribute("data-index"), 10);
  if (action === "delete") {
    const confirmed = await showModal("Excluir Evento", "Tem certeza que deseja excluir este evento?");
    if (confirmed) {
      const events = loadEvents();
      events.splice(idx, 1);
      saveEvents(events);
      renderEvents();
    }
  } else if (action === "edit") {
    showFormModal(idx);
  }
});

// Export events to JSON
document.getElementById("export-json").addEventListener("click", () => {
  const events = loadEvents();
  const dataStr = JSON.stringify(events, null, 2);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const exportFileDefaultName = "eventos.json";
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
});

// Import events from JSON
const importFileInput = document.getElementById("import-file");
document.getElementById("import-json").addEventListener("click", () => {
  importFileInput.click();
});

importFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const newEvents = JSON.parse(event.target.result);
      if (Array.isArray(newEvents) && newEvents.every(evt => evt.name && evt.date)) {
        const confirmed = await showModal("Importar Eventos", "A importação substituirá os eventos existentes. Continuar?");
        if (confirmed) {
          saveEvents(newEvents);
          renderEvents();
        }
      } else {
        await showModal("Erro de Importação", "Formato de arquivo JSON inválido.", "OK", null);
      }
    } catch (error) {
      await showModal("Erro de Importação", "Erro ao ler ou analisar o arquivo JSON.", "OK", null);
    }
    importFileInput.value = ""; // Reset file input
  };
  reader.readAsText(file);
});

// Confirmation Modal
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalConfirm = document.getElementById("modal-confirm");
const modalCancel = document.getElementById("modal-cancel");
let modalResolve;

function showModal(title, message, confirmText = "Confirmar", cancelText = "Cancelar") {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalConfirm.textContent = confirmText;
  
  if (cancelText) {
    modalCancel.textContent = cancelText;
    modalCancel.classList.remove("hidden");
  } else {
    modalCancel.classList.add("hidden");
  }

  modal.classList.remove("hidden");

  return new Promise((resolve) => {
    modalResolve = resolve;
  });
}

function hideModal(result) {
  modal.classList.add("hidden");
  if (modalResolve) {
    modalResolve(result);
    modalResolve = null;
  }
}

modalConfirm.addEventListener("click", () => hideModal(true));
modalCancel.addEventListener("click", () => hideModal(false));


// Initial render
renderEvents();
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

// Add or update event
const form = document.getElementById("event-form");
let editIndex = null;
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("event-name").value.trim();
  const date = document.getElementById("event-date").value;
  if (!name || !date) return;
  const events = loadEvents();
  if (editIndex !== null) {
    events[editIndex] = { name, date };
    editIndex = null;
  } else {
    events.push({ name, date });
  }
  saveEvents(events);
  form.reset();
  document.getElementById("form-button-text").textContent = "Adicionar Evento";
  renderEvents();
});

// Handle edit/delete buttons
document.getElementById("event-list").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.getAttribute("data-action");
  const idx = parseInt(btn.getAttribute("data-index"), 10);
  const events = loadEvents();
  if (action === "delete") {
    if (confirm("Excluir este evento?")) {
      events.splice(idx, 1);
      saveEvents(events);
      renderEvents();
    }
  } else if (action === "edit") {
    const evt = events[idx];
    document.getElementById("event-name").value = evt.name;
    document.getElementById("event-date").value = evt.date;
    document.getElementById("form-button-text").textContent = "Atualizar Evento";
    editIndex = idx;
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
  reader.onload = (event) => {
    try {
      const newEvents = JSON.parse(event.target.result);
      if (Array.isArray(newEvents) && newEvents.every(evt => evt.name && evt.date)) {
        if (confirm("A importação substituirá os eventos existentes. Continuar?")) {
          saveEvents(newEvents);
          renderEvents();
        }
      } else {
        alert("Formato de arquivo JSON inválido.");
      }
    } catch (error) {
      alert("Erro ao ler ou analisar o arquivo JSON.");
    }
    importFileInput.value = ""; // Reset file input
  };
  reader.readAsText(file);
});

// Initial render
renderEvents();

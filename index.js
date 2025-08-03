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
    const item = document.createElement("li");
    item.className = "flex justify-between items-center border rounded p-2";
    item.innerHTML = `
          <div>
            <p class="font-medium">${evt.name}</p>
            <p class="text-sm text-gray-600">Started: ${evt.date}</p>
            <p class="text-sm text-gray-700">Elapsed: ${years}y ${months}m ${days}d</p>
          </div>
          <div class="flex space-x-2">
            <button data-action="edit" data-index="${idx}" class="text-blue-500 hover:text-blue-700">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button data-action="delete" data-index="${idx}" class="text-red-500 hover:text-red-700">
              <i class="bi bi-trash-fill"></i>
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
  document.getElementById("form-button-text").textContent = "Add Event";
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
    if (confirm("Delete this event?")) {
      events.splice(idx, 1);
      saveEvents(events);
      renderEvents();
    }
  } else if (action === "edit") {
    const evt = events[idx];
    document.getElementById("event-name").value = evt.name;
    document.getElementById("event-date").value = evt.date;
    document.getElementById("form-button-text").textContent = "Update Event";
    editIndex = idx;
  }
});

// Initial render
renderEvents();

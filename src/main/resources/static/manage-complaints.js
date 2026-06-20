document.addEventListener("DOMContentLoaded", () => {

  // ── Auth Check ──────────────────────────────────────────────────
  const role = localStorage.getItem("role");
  if (!role || role !== "ADMIN") {
    window.location.href = "login.html";
    return;
  }

  // ── Admin name in navbar ────────────────────────────────────────
  const userName      = localStorage.getItem("userName");
  const adminNameEl   = document.getElementById("adminName");
  const adminAvatarEl = document.getElementById("adminAvatar");
  if (adminNameEl   && userName) adminNameEl.textContent   = userName;
  if (adminAvatarEl && userName) adminAvatarEl.textContent = userName.charAt(0).toUpperCase();

  // ── Event listeners — safely attached after DOM ready ──────────
  const searchEl   = document.getElementById("searchInput");
  const statusEl   = document.getElementById("filterStatus");
  const priorityEl = document.getElementById("filterPriority");

  if (searchEl)   searchEl.addEventListener("keyup",  applyFilters);
  if (statusEl)   statusEl.addEventListener("change", applyFilters);
  if (priorityEl) priorityEl.addEventListener("change", applyFilters);

  loadComplaints();

});

let allComplaints  = [];
let activeUpdateId = null;
let activeDeleteId = null;

// ── Load Complaints ─────────────────────────────────────────────────

async function loadComplaints() {

  showState("loading");

  try {

    const response = await fetch("http://localhost:8080/api/complaints");

    if (!response.ok) throw new Error("HTTP " + response.status);

    allComplaints = await response.json();

    updateHeaderStats();
    renderComplaints(allComplaints);

  } catch (error) {
    console.error("loadComplaints error:", error);
    showState("error");
  }

}

// ── Header Stats ────────────────────────────────────────────────────

function updateHeaderStats() {
  const t = document.getElementById("headerTotal");
  const p = document.getElementById("headerPending");
  const r = document.getElementById("headerResolved");
  if (t) t.textContent = allComplaints.length + " Total";
  if (p) p.textContent = allComplaints.filter(c => c.status === "PENDING").length  + " Pending";
  if (r) r.textContent = allComplaints.filter(c => c.status === "RESOLVED").length + " Resolved";
}

// ── Filters ─────────────────────────────────────────────────────────

function applyFilters() {
  const keyword  = (document.getElementById("searchInput")?.value  || "").toLowerCase();
  const status   =  document.getElementById("filterStatus")?.value  || "";
  const priority =  document.getElementById("filterPriority")?.value || "";

  const filtered = allComplaints.filter(c => {
    const matchSearch =
      !keyword ||
      c.title?.toLowerCase().includes(keyword)    ||
      c.category?.toLowerCase().includes(keyword) ||
      c.location?.toLowerCase().includes(keyword);
    const matchStatus   = !status   || c.status   === status;
    const matchPriority = !priority || c.priority === priority;
    return matchSearch && matchStatus && matchPriority;
  });

  renderComplaints(filtered);
}

function clearFilters() {
  const s = document.getElementById("searchInput");
  const f = document.getElementById("filterStatus");
  const p = document.getElementById("filterPriority");
  if (s) s.value = "";
  if (f) f.value = "";
  if (p) p.value = "";
  renderComplaints(allComplaints);
}

// ── Render Table ────────────────────────────────────────────────────

function renderComplaints(complaints) {

  const table = document.getElementById("complaintsTable");
  if (!table) return;

  table.innerHTML = "";

  if (!complaints || complaints.length === 0) {
    showState("empty");
    return;
  }

  showState("table");

  complaints.forEach(c => {

    const row = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = "#" + c.id;

    const tdNo = document.createElement("td");
    tdNo.textContent = c.complaintNumber || "-";

    const tdTitle = document.createElement("td");
    tdTitle.textContent = c.title || "-";

    const tdCat = document.createElement("td");
    tdCat.textContent = c.category || "-";

    // Priority badge
    const tdPriority = document.createElement("td");
    const pSpan = document.createElement("span");
    pSpan.className   = "priority " + getPriorityClass(c.priority);
    pSpan.textContent = c.priority || "-";
    tdPriority.appendChild(pSpan);

    // Status badge
    const tdStatus = document.createElement("td");
    const sSpan = document.createElement("span");
    sSpan.className   = "status " + getStatusClass(c.status);
    sSpan.textContent = formatStatus(c.status);
    tdStatus.appendChild(sSpan);

    // ✅ Action buttons — IDs stored as data, no inline onclick issues
    const tdActions = document.createElement("td");

    const viewBtn = document.createElement("button");
    viewBtn.className   = "action-btn view-btn";
    viewBtn.textContent = "👁 View";
    viewBtn.addEventListener("click", () => viewComplaint(c.id));

    const updateBtn = document.createElement("button");
    updateBtn.className   = "action-btn update-btn";
    updateBtn.textContent = "🔄 Status";
    updateBtn.addEventListener("click", () => openStatusModal(c.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className   = "action-btn delete-btn";
    deleteBtn.textContent = "🗑 Delete";
    deleteBtn.addEventListener("click", () => openDeleteModal(c.id));

    tdActions.appendChild(viewBtn);
    tdActions.appendChild(updateBtn);
    tdActions.appendChild(deleteBtn);

    row.appendChild(tdId);
    row.appendChild(tdNo);
    row.appendChild(tdTitle);
    row.appendChild(tdCat);
    row.appendChild(tdPriority);
    row.appendChild(tdStatus);
    row.appendChild(tdActions);

    table.appendChild(row);

  });

}

// ── Show/Hide States ────────────────────────────────────────────────

function showState(state) {
  const map = {
    loading : "loadingState",
    error   : "errorState",
    empty   : "emptyState",
    table   : "tableWrapper"
  };
  Object.entries(map).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) el.style.display = (key === state) ? "block" : "none";
  });
}

// ── Modal Helpers ───────────────────────────────────────────────────

function openModal(id)  {
  const el = document.getElementById(id);
  if (el) el.classList.add("open");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("open");
}

// ✅ Click outside modal box to close
function handleOverlayClick(event, modalId) {
  if (event.target === event.currentTarget) {
    closeModal(modalId);
  }
}

// ── View Modal ──────────────────────────────────────────────────────

function viewComplaint(id) {

  const c = allComplaints.find(c => c.id === id);
  if (!c) return;

  const fields = [
    ["ID",          "#" + c.id],
    ["Title",       c.title],
    ["Category",    c.category],
    ["Priority",    c.priority],
    ["Status",      formatStatus(c.status)],
    ["Location",    c.location],
    ["Landmark",    c.landmark     || "-"],
    ["Mobile",      c.mobileNumber || "-"],
    ["Description", c.description],
  ];

  const body = document.getElementById("modalBody");
  if (!body) return;
  body.innerHTML = "";

  fields.forEach(([label, value]) => {
    const row  = document.createElement("div");
    row.className = "detail-row";

    const lEl = document.createElement("span");
    lEl.className   = "detail-label";
    lEl.textContent = label;

    const vEl = document.createElement("span");
    vEl.className   = "detail-value";
    vEl.textContent = value || "-";

    row.appendChild(lEl);
    row.appendChild(vEl);
    body.appendChild(row);
  });

  openModal("viewModal");

}

function closeViewModal()   { closeModal("viewModal");   }

// ── Status Modal ────────────────────────────────────────────────────

function openStatusModal(id) {
  activeUpdateId = id;
  openModal("statusModal");
}

function closeStatusModal() {
  activeUpdateId = null;
  closeModal("statusModal");
}

async function submitStatus(status) {

  if (!activeUpdateId) return;

  const id = activeUpdateId;
  closeStatusModal();

  try {

    const response = await fetch(
      `http://localhost:8080/api/complaints/${id}`,
      {
        method  : "PUT",
        headers : { "Content-Type": "application/json" },
        body    : JSON.stringify({ status })
      }
    );

    if (response.ok) {
      showToast("✅ Status updated to " + formatStatus(status), "success");
      await loadComplaints();
    } else {
      showToast("❌ Failed to update status", "error");
    }

  } catch (error) {
    console.error(error);
    showToast("❌ Server not reachable", "error");
  }

}

// ── Delete Modal ────────────────────────────────────────────────────

function openDeleteModal(id) {
  activeDeleteId = id;
  openModal("deleteModal");
}

function closeDeleteModal() {
  activeDeleteId = null;
  closeModal("deleteModal");
}

async function confirmDelete() {

  if (!activeDeleteId) return;

  const id = activeDeleteId;
  closeDeleteModal();

  try {

    const response = await fetch(
      `http://localhost:8080/api/complaints/${id}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      showToast("🗑️ Complaint deleted successfully", "success");
      await loadComplaints();
    } else {
      showToast("❌ Failed to delete complaint", "error");
    }

  } catch (error) {
    console.error(error);
    showToast("❌ Server not reachable", "error");
  }

}

// ── Toast ───────────────────────────────────────────────────────────

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className   = `toast ${type} show`;
  setTimeout(() => { toast.className = "toast"; }, 3000);
}

// ── Helpers ─────────────────────────────────────────────────────────

function formatStatus(status) {
  return { PENDING: "Pending", IN_PROGRESS: "In Progress", RESOLVED: "Resolved" }[status] || status || "-";
}

function getStatusClass(status) {
  return { PENDING: "status-pending", IN_PROGRESS: "status-progress", RESOLVED: "status-resolved" }[status] || "";
}

function getPriorityClass(priority) {
  return { Low: "priority-low", Medium: "priority-medium", High: "priority-high", Emergency: "priority-emergency" }[priority] || "";
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", async () => {

  // ── Auth Check ───────────────────────────────────────────────────
  const role = localStorage.getItem("role");
  if (!role || role !== "ADMIN") {
    window.location.href = "login.html";
    return;
  }

  // ── Admin Info ───────────────────────────────────────────────────
  const userName  = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  const adminNameEl   = document.getElementById("adminName");
  const adminEmailEl  = document.getElementById("adminEmail");
  const adminAvatarEl = document.getElementById("adminAvatar");

  if (adminNameEl)   adminNameEl.textContent   = userName  || "Admin";
  if (adminEmailEl)  adminEmailEl.textContent  = userEmail || "admin@email.com";
  if (adminAvatarEl) adminAvatarEl.textContent = userName  ? userName.charAt(0).toUpperCase() : "A";

  // ── Current Date ─────────────────────────────────────────────────
  const dateEl = document.getElementById("currentDate");
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year   : "numeric",
      month  : "long",
      day    : "numeric"
    });
  }

  // ── Load Dashboard ───────────────────────────────────────────────
  await loadDashboard();

});

// ── Load Dashboard ──────────────────────────────────────────────────

async function loadDashboard() {

  const loadingState = document.getElementById("loadingState");
  const errorState   = document.getElementById("errorState");
  const tableWrapper = document.getElementById("tableWrapper");

  // Show loading spinner
  if (loadingState) loadingState.style.display = "block";
  if (errorState)   errorState.style.display   = "none";
  if (tableWrapper) tableWrapper.style.display  = "none";

  try {

    const response = await fetch("http://localhost:8080/api/complaints");

    if (!response.ok) throw new Error("HTTP error: " + response.status);

    const complaints = await response.json();

    console.log("✅ Complaints loaded:", complaints.length);
    console.log("📋 Sample:", complaints[0]); // shows exact field names from backend

    // ── Stats ──────────────────────────────────────────────────────
    const totalEl    = document.getElementById("totalComplaints");
    const pendingEl  = document.getElementById("pendingComplaints");
    const progressEl = document.getElementById("progressComplaints");
    const resolvedEl = document.getElementById("resolvedComplaints");

    if (totalEl)    totalEl.textContent    = complaints.length;
    if (pendingEl)  pendingEl.textContent  = complaints.filter(c => c.status === "PENDING").length;
    if (progressEl) progressEl.textContent = complaints.filter(c => c.status === "IN_PROGRESS").length;
    if (resolvedEl) resolvedEl.textContent = complaints.filter(c => c.status === "RESOLVED").length;

    // ── Recent Complaints Table ────────────────────────────────────
    const table = document.getElementById("complaintsTable");

    if (!table) {
      console.error("❌ complaintsTable element not found in HTML");
      return;
    }

    table.innerHTML = "";

    if (complaints.length === 0) {

      // Show empty message
      const emptyRow = document.createElement("tr");
      const emptyTd  = document.createElement("td");
      emptyTd.colSpan    = 5;
      emptyTd.textContent = "No complaints found.";
      emptyTd.style.cssText = "text-align:center; padding:30px; color:#94a3b8;";
      emptyRow.appendChild(emptyTd);
      table.appendChild(emptyRow);

    } else {

      // ✅ Use createElement + textContent — no XSS, no silent failures
      complaints.slice(0, 10).forEach(c => {

        const row = document.createElement("tr");

        // ID
        const tdId = document.createElement("td");
        tdId.textContent = "#" + c.id;

        // Title
        const tdTitle = document.createElement("td");
        tdTitle.textContent = c.title || "-";

        // Category
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

        row.appendChild(tdId);
        row.appendChild(tdTitle);
        row.appendChild(tdCat);
        row.appendChild(tdPriority);
        row.appendChild(tdStatus);

        table.appendChild(row);

      });

    }

    // Show table
    if (loadingState) loadingState.style.display = "none";
    if (tableWrapper) tableWrapper.style.display  = "block";

  } catch (error) {

    console.error("❌ loadDashboard error:", error);
    if (loadingState) loadingState.style.display = "none";
    if (errorState)   errorState.style.display   = "block";

  }

}

function retryLoad() {
  loadDashboard();
}

// ── Helpers ─────────────────────────────────────────────────────────

function formatStatus(status) {
  return {
    PENDING     : "Pending",
    IN_PROGRESS : "In Progress",
    RESOLVED    : "Resolved"
  }[status] || status || "-";
}

function getStatusClass(status) {
  return {
    PENDING     : "status-pending",
    IN_PROGRESS : "status-progress",
    RESOLVED    : "status-resolved"
  }[status] || "";
}

function getPriorityClass(priority) {
  return {
    Low       : "priority-low",
    Medium    : "priority-medium",
    High      : "priority-high",
    Emergency : "priority-emergency"
  }[priority] || "";
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
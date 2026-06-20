document.addEventListener("DOMContentLoaded", () => {

  const role = localStorage.getItem("role");
  if (!role || role !== "USER") {
    window.location.href = "login.html";
    return;
  }

  const userName = localStorage.getItem("userName") || "User";
  document.getElementById("userName").textContent = userName;

  const sidebarName = document.getElementById("sidebarName");
  if (sidebarName) sidebarName.textContent = userName;

  const avatarEl = document.getElementById("avatarInitial");
  if (avatarEl) avatarEl.textContent = userName.charAt(0).toUpperCase();

  const dateEl = document.getElementById("todayDate");
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year:    "numeric",
      month:   "long",
      day:     "numeric",
    });
  }

  loadDashboard();
});

async function loadDashboard() {

  const userId = localStorage.getItem("userId");

  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/complaints/user/${userId}`, {
      method:  "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.clear();
      window.location.href = "login.html";
      return;
    }

    if (!response.ok) throw new Error("Server error: " + response.status);

    const complaints = await response.json();

    animateCount("total",    complaints.length);
    animateCount("pending",  complaints.filter(c => c.status === "PENDING").length);
    animateCount("progress", complaints.filter(c => c.status === "IN_PROGRESS").length);
    animateCount("resolved", complaints.filter(c => c.status === "RESOLVED").length);

    const table = document.getElementById("complaintTable");
    table.innerHTML = "";

    const recent = complaints.slice(0, 5);

    if (recent.length === 0) {
      const row  = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan       = 3;
      cell.textContent   = "You haven't submitted any complaints yet.";
      cell.style.cssText = "text-align:center;color:#94a3b8;padding:40px;font-size:14px;";
      row.appendChild(cell);
      table.appendChild(row);
      return;
    }

    recent.forEach(c => {
      const row = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.className   = "id-cell";
      tdId.textContent = "#" + c.id;

      const tdTitle = document.createElement("td");
      tdTitle.textContent = c.title;

      const tdStatus = document.createElement("td");
      tdStatus.className = "status-cell";
      const pill = document.createElement("span");
      pill.classList.add("pill");

      const statusMap = {
        "PENDING":     { label: "Pending",     cls: "pill-pending"  },
        "IN_PROGRESS": { label: "In Progress", cls: "pill-progress" },
        "RESOLVED":    { label: "Resolved",    cls: "pill-resolved" },
      };

      const mapped = statusMap[c.status] || { label: c.status, cls: "pill-default" };
      pill.textContent = mapped.label;
      pill.classList.add(mapped.cls);
      tdStatus.appendChild(pill);

      row.appendChild(tdId);
      row.appendChild(tdTitle);
      row.appendChild(tdStatus);
      table.appendChild(row);
    });

  } catch (error) {
    console.error(error);

    const table = document.getElementById("complaintTable");
    if (table) {
      table.innerHTML = "";
      const row  = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan       = 3;
      cell.textContent   = "Unable to load your complaints. Please try again later.";
      cell.style.cssText = "text-align:center;color:#ef4444;padding:32px;font-size:14px;";
      row.appendChild(cell);
      table.appendChild(row);
    }

    ["total", "pending", "progress", "resolved"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = "—";
    });
  }
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 700;
  const start    = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
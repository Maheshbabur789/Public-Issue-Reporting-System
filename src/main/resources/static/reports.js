document.addEventListener("DOMContentLoaded", () => {

  const role = localStorage.getItem("role");
  if (role !== "ADMIN") {
    window.location.href = "login.html";
    return;
  }

  loadReports();
});

async function loadReports() {
  try {
    const response = await fetch("http://localhost:8080/api/complaints");

    if (!response.ok) throw new Error("Failed to fetch reports");

    const complaints = await response.json();

    let pending = 0, progress = 0, resolved = 0;

    complaints.forEach(c => {
      const s = (c.status || "").toLowerCase().replace(/_/g, " ");
      if (s === "pending")          pending++;
      else if (s === "in progress") progress++;
      else if (s === "resolved")    resolved++;
    });

    const total = complaints.length;

    animateCount("totalComplaints",    total);
    animateCount("pendingComplaints",  pending);
    animateCount("progressComplaints", progress);
    animateCount("resolvedComplaints", resolved);

    document.getElementById("tableCount").textContent =
      total + " record" + (total !== 1 ? "s" : "");

    const maxVal = Math.max(pending, progress, resolved, 1);

    setTimeout(() => {
      setBar("barPending",  pending,  maxVal);
      setBar("barProgress", progress, maxVal);
      setBar("barResolved", resolved, maxVal);
    }, 200);

    const tbody = document.getElementById("reportTable");
    tbody.innerHTML = "";

    if (complaints.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="loading-row">No complaints found.</td></tr>`;
      return;
    }

    complaints.forEach(c => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>#${c.id}</td>
        <td>${escapeHtml(c.title)}</td>
        <td>${escapeHtml(c.category)}</td>
        <td>${escapeHtml(c.department)}</td>
        <td>${statusBadge(c.status)}</td>
        <td>${priorityLabel(c.priority)}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error(error);
    document.getElementById("reportTable").innerHTML =
      `<tr><td colspan="6" class="loading-row">Unable to load reports. Check your connection.</td></tr>`;
    document.getElementById("tableCount").textContent = "Error";
  }
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 600;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function setBar(id, val, max) {
  const el = document.getElementById(id);
  if (el) el.style.width = Math.round((val / max) * 100) + "%";
}

function statusBadge(status) {
  const s = (status || "").toLowerCase().replace(/_/g, " ");
  if (s === "pending")     return `<span class="badge badge-pending">Pending</span>`;
  if (s === "in progress") return `<span class="badge badge-progress">In progress</span>`;
  if (s === "resolved")    return `<span class="badge badge-resolved">Resolved</span>`;
  return `<span class="badge badge-default">${escapeHtml(status)}</span>`;
}

function priorityLabel(priority) {
  const p = (priority || "").toLowerCase();
  if (p === "high")   return `<span class="priority-high">High</span>`;
  if (p === "medium") return `<span class="priority-medium">Medium</span>`;
  if (p === "low")    return `<span class="priority-low">Low</span>`;
  return escapeHtml(priority);
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
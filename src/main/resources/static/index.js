function checkLogin() {
  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "submit.html";
  } else {
    alert("⚠️ Please login first to submit an issue.");
  }
}

function toggleMenu() {
  const nav = document.getElementById("mobileNav");
  if (nav) nav.classList.toggle("open");
}

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href");
    if (id === "#") return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
console.log("AUTH JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

    const user = localStorage.getItem("user");
    console.log("USER:", user);

    if (!user) {
        alert("Please login first");
        window.location.replace("login.html");
        return;
    }

});

// logout
function logout() {
    localStorage.removeItem("user");
    window.location.replace("login.html");
}
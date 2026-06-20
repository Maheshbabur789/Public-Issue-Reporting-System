const form = document.getElementById("registerForm");
const message = document.getElementById("message");

function togglePassword() {
    const password = document.getElementById("password");

    password.type =
        password.type === "password"
            ? "text"
            : "password";
}

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const submitBtn = document.querySelector(".btn");

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    message.innerHTML = "";

    if (name.length < 3) {
        message.style.color = "red";
        message.innerHTML = "❌ Name must contain at least 3 characters";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        message.style.color = "red";
        message.innerHTML = "❌ Enter valid email address";
        return;
    }

    if (password.length < 6) {
        message.style.color = "red";
        message.innerHTML = "❌ Password must be at least 6 characters";
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Creating Account...";

    const user = {
        name,
        email,
        password,
        role
    };

    try {

        const response = await fetch(
            "http://localhost:8080/api/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }
        );

        const result = await response.text();

        if (response.ok) {

            message.style.color = "green";
            message.innerHTML =
                "✅ Account created successfully! Redirecting...";

            form.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);

        } else {

            message.style.color = "red";
            message.innerHTML = "❌ " + result;
        }

    } catch (error) {

        console.error(error);

        message.style.color = "red";
        message.innerHTML =
            "❌ Cannot connect to Spring Boot server";

    } finally {

        submitBtn.disabled = false;
        submitBtn.innerHTML = "Create Account";
    }

});

document.addEventListener("DOMContentLoaded", function () {

    const year = document.getElementById("year");

    if (year) {
        year.innerText = new Date().getFullYear();
    }

});
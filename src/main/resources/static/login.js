document.addEventListener("DOMContentLoaded", () => {


document.getElementById("loginForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("message");

    message.style.color = "#2563eb";
    message.innerText = "Logging in...";

    try {

        const res = await fetch(
            "http://localhost:8080/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const text = await res.text();

        console.log("SERVER:", text);

        if (res.ok) {

            let user;

            try {

                user = JSON.parse(text);

            } catch {

                message.style.color = "red";
                message.innerText =
                    "Invalid server response";

                return;
            }

            // Store User Data

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "userId",
                user.id
            );

            localStorage.setItem(
                "userName",
                user.name
            );

            localStorage.setItem(
                "userEmail",
                user.email
            );

            localStorage.setItem(
                "role",
                user.role
            );

            message.style.color = "green";
            message.innerText =
                "Login Successful";

            // Role Based Redirect

            setTimeout(() => {

                if (user.role === "ADMIN") {

                    window.location.href =
                        "admin-dashboard.html";

                } else {

                    window.location.href =
                        "dashboard.html";
                }

            }, 1000);

        } else {

            message.style.color = "red";
            message.innerText = text;
        }

    } catch (err) {

        console.error(err);

        message.style.color = "red";
        message.innerText =
            "Server Error";
    }

});


});

// Show / Hide Password

function togglePassword() {

const input =
    document.getElementById("password");

input.type =
    input.type === "password"
    ? "text"
    : "password";


}

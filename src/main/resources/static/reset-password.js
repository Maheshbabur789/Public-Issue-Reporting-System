document.addEventListener("DOMContentLoaded", function () {

    const savedEmail = localStorage.getItem("resetEmail");

    if (savedEmail) {
        document.getElementById("email").value = savedEmail;
    }

});

document.getElementById("resetForm")
.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const otp =
        document.getElementById("otp").value.trim();

    const password =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("message");

    if (password !== confirmPassword) {

        message.innerHTML =
            "❌ Passwords do not match";

        message.style.color =
            "red";

        return;
    }

    try {

        const response = await fetch(
            `http://localhost:8080/api/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&newPassword=${encodeURIComponent(password)}`,
            {
                method: "POST"
            }
        );

        const result =
            await response.text();

        if (response.ok) {

            message.innerHTML =
                "✅ Password Reset Successful";

            message.style.color =
                "green";

            localStorage.removeItem("resetEmail");

            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 2000);

        } else {

            message.innerHTML =
                "❌ " + result;

            message.style.color =
                "red";
        }

    } catch (error) {

        console.error(error);

        message.innerHTML =
            "❌ Server Not Reachable";

        message.style.color =
            "red";
    }

});
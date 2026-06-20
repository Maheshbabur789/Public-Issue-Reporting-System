document.getElementById("forgotForm")
.addEventListener("submit", async function(e){

e.preventDefault();

const email =
    document.getElementById("email").value.trim();

const message =
    document.getElementById("message");

if(email === ""){

    message.innerHTML =
        "❌ Please enter email address";

    message.style.color =
        "#ef4444";

    return;
}

try{

    const response = await fetch(
        `http://localhost:8080/api/auth/send-otp?email=${encodeURIComponent(email)}`,
        {
            method:"POST"
        }
    );

    const result =
        await response.text();

    if(response.ok){

        message.innerHTML =
            "✅ OTP Sent Successfully";

        message.style.color =
            "#22c55e";

        // Save email for reset page
        localStorage.setItem(
            "resetEmail",
            email
        );

        setTimeout(() => {

            window.location.href =
                "reset-password.html";

        },1500);

    }else{

        message.innerHTML =
            "❌ " + result;

        message.style.color =
            "#ef4444";
    }

}catch(error){

    console.error(error);

    message.innerHTML =
        "❌ Server Not Reachable";

    message.style.color =
        "#ef4444";
}


});

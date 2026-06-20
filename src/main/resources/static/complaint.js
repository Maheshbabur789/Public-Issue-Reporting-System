document.addEventListener("DOMContentLoaded", () => {

  const userId   = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  if (!userId) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  const navUserName = document.getElementById("navUserName");
  if (navUserName && userName) {
    navUserName.textContent = userName;
  }

  // Description character counter
  const descTextarea = document.getElementById("description");
  const descCount    = document.getElementById("descCount");

  descTextarea.addEventListener("input", () => {
    const len = descTextarea.value.length;
    descCount.textContent = `${len} / 1000`;
    descCount.style.color = len > 900 ? "#ef4444" : "#94a3b8";
  });

  // Real-time mobile validation
  const mobileInput = document.getElementById("mobileNumber");
  mobileInput.addEventListener("input", () => {
    // Allow digits only
    mobileInput.value = mobileInput.value.replace(/\D/g, "");
    if (mobileInput.value.length === 10) {
      validateMobile(mobileInput.value);
    } else {
      clearFieldState("mobileNumber", "mobileError");
    }
  });

});

// ─── Validation Helpers ───────────────────────────────────────────────

function setError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) {
    field.classList.remove("valid");
    field.classList.add("invalid");
  }
  if (error) error.textContent = message;
}

function setValid(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) {
    field.classList.remove("invalid");
    field.classList.add("valid");
  }
  if (error) error.textContent = "";
}

function clearFieldState(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) {
    field.classList.remove("valid", "invalid");
  }
  if (error) error.textContent = "";
}

// ─── Mobile Number Validation ─────────────────────────────────────────

function validateMobile(number) {

  // Must be exactly 10 digits
  if (!/^\d{10}$/.test(number)) {
    setError("mobileNumber", "mobileError", "Enter a valid 10-digit mobile number.");
    document.querySelector(".phone-input").classList.add("invalid");
    document.querySelector(".phone-input").classList.remove("valid");
    return false;
  }

  // Must start with 6, 7, 8, or 9 (valid Indian mobile prefixes)
  if (!/^[6-9]/.test(number)) {
    setError("mobileNumber", "mobileError", "Mobile number must start with 6, 7, 8, or 9.");
    document.querySelector(".phone-input").classList.add("invalid");
    document.querySelector(".phone-input").classList.remove("valid");
    return false;
  }

  // Block obviously fake/sequential numbers
  const INVALID_NUMBERS = [
    "1234567890", "0987654321", "9999999999", "8888888888",
    "7777777777", "6666666666", "1111111111", "0000000000",
    "1234512345", "9876543210"
  ];
  if (INVALID_NUMBERS.includes(number)) {
    setError("mobileNumber", "mobileError", "Please enter a real mobile number.");
    document.querySelector(".phone-input").classList.add("invalid");
    document.querySelector(".phone-input").classList.remove("valid");
    return false;
  }

  // Block all-same-digit numbers (e.g. 9999999999, 7777777777)
  if (/^(\d)\1{9}$/.test(number)) {
    setError("mobileNumber", "mobileError", "Please enter a real mobile number.");
    document.querySelector(".phone-input").classList.add("invalid");
    document.querySelector(".phone-input").classList.remove("valid");
    return false;
  }

  // Valid
  clearFieldState("mobileNumber", "mobileError");
  document.querySelector(".phone-input").classList.remove("invalid");
  document.querySelector(".phone-input").classList.add("valid");
  return true;
}

// ─── Full Form Validation ─────────────────────────────────────────────

function validateForm() {
  let isValid = true;

  // Title
  const title = document.getElementById("title").value.trim();
  if (!title) {
    setError("title", "titleError", "Complaint title is required.");
    isValid = false;
  } else if (title.length < 5) {
    setError("title", "titleError", "Title must be at least 5 characters.");
    isValid = false;
  } else {
    setValid("title", "titleError");
  }

  // Category
  const category = document.getElementById("category").value;
  if (!category) {
    setError("category", "categoryError", "Please select a category.");
    isValid = false;
  } else {
    setValid("category", "categoryError");
  }

  // Description
  const description = document.getElementById("description").value.trim();
  if (!description) {
    setError("description", "descriptionError", "Description is required.");
    isValid = false;
  } else if (description.length < 20) {
    setError("description", "descriptionError", "Description must be at least 20 characters.");
    isValid = false;
  } else {
    setValid("description", "descriptionError");
  }

  // Location
  const location = document.getElementById("location").value.trim();
  if (!location) {
    setError("location", "locationError", "Location is required.");
    isValid = false;
  } else {
    setValid("location", "locationError");
  }

  // Mobile
  const mobile = document.getElementById("mobileNumber").value.trim();
  if (!mobile) {
    setError("mobileNumber", "mobileError", "Mobile number is required.");
    document.querySelector(".phone-input").classList.add("invalid");
    isValid = false;
  } else if (!validateMobile(mobile)) {
    isValid = false;
  }

  // Image size check (max 5MB)
  const imageInput = document.getElementById("image");
  if (imageInput.files.length > 0) {
    const fileSize = imageInput.files[0].size / 1024 / 1024;
    if (fileSize > 5) {
      setError("image", "imageError", "Image must be smaller than 5MB.");
      isValid = false;
    } else {
      clearFieldState("image", "imageError");
    }
  }

  return isValid;
}

// ─── Form Submit ──────────────────────────────────────────────────────

const form    = document.getElementById("complaintForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (e) {

  e.preventDefault();

  message.textContent = "";

  if (!validateForm()) {
    message.style.color    = "#ef4444";
    message.textContent    = "⚠️ Please fix the errors above before submitting.";
    return;
  }

  const userId    = localStorage.getItem("userId");
  const submitBtn = document.querySelector(".submit-btn");

  submitBtn.disabled    = true;
  submitBtn.textContent = "Submitting...";

  const complaint = {
    title:        document.getElementById("title").value.trim(),
    category:     document.getElementById("category").value,
    priority:     document.getElementById("priority").value,
    department:   document.getElementById("department").value,
    description:  document.getElementById("description").value.trim(),
    location:     document.getElementById("location").value.trim(),
    landmark:     document.getElementById("landmark").value.trim(),
    mobileNumber: document.getElementById("mobileNumber").value.trim()
  };

  try {

    const response = await fetch(
      `http://localhost:8080/api/complaints/${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaint)
      }
    );

    if (response.ok) {

      const result = await response.json();
      console.log(result);

      message.style.color    = "#16a34a";
      message.textContent    = "✅ Complaint submitted successfully! Redirecting...";

      form.reset();

      // Clear all valid states after reset
      document.querySelectorAll(".valid, .invalid").forEach(el => {
        el.classList.remove("valid", "invalid");
      });

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);

    } else {

      const error = await response.text();
      message.style.color = "#dc2626";
      message.textContent = "❌ " + error;

    }

  } catch (error) {

    console.error(error);
    message.style.color = "#dc2626";
    message.textContent = "❌ Server not reachable. Please try again.";

  } finally {

    submitBtn.disabled    = false;
    submitBtn.textContent = "Submit Complaint";

  }

});

function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
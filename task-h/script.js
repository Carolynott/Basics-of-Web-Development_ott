// script.js
// Author: Carolyn Ott
// Date: 2025-10-31
// Handles custom validation and table row insertion

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addCourseForm");
  const tableBody = document.querySelector("#timetable");
  const timestampInput = document.getElementById("timestamp");

  // ✅ Updated timestamp function: YYYY-MM-DD HH:MM
  const updateTimestamp = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    timestampInput.value = `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  updateTimestamp();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateTimestamp();

    // Clear previous errors
    document.querySelectorAll("p[id$='Error']").forEach(el => el.textContent = "");

    // Collect field values
    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const birthDate = form.birthDate.value;
    const terms = form.terms.checked;

    let valid = true;

    // Validate name
    const nameParts = fullName.split(/\s+/);
    if (nameParts.length < 2 || nameParts.some(p => p.length < 2)) {
      valid = false;
      document.getElementById("nameError").textContent =
        "Please enter your full name (first and last, at least 2 letters each).";
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      valid = false;
      document.getElementById("emailError").textContent =
        "Please enter a valid email address.";
    }

    // Validate phone (Finnish format +358...)
    const phonePattern = /^\+358\d{7,10}$/;
    if (!phonePattern.test(phone)) {
      valid = false;
      document.getElementById("phoneError").textContent =
        "Please enter a valid Finnish number (+358 followed by 7–10 digits).";
    }

    // Validate birth date
    if (!birthDate) {
      valid = false;
      document.getElementById("birthError").textContent =
        "Please choose your birth date.";
    } else {
      const birth = new Date(birthDate);
      const today = new Date();
      if (birth > today) {
        valid = false;
        document.getElementById("birthError").textContent =
          "Birth date cannot be in the future.";
      } else {
        // Check if 13+
        const age = today.getFullYear() - birth.getFullYear();
        const ageDate = new Date(birth);
        ageDate.setFullYear(birth.getFullYear() + 13);
        if (today < ageDate) {
          valid = false;
          document.getElementById("birthError").textContent =
            "You must be at least 13 years old.";
        }
      }
    }

    // Validate terms
    if (!terms) {
      valid = false;
      document.getElementById("termsError").textContent =
        "You must accept the terms before submitting.";
    }

    if (!valid) return;

    // ✅ Add new row with formatted timestamp
    const newRow = document.createElement("tr");
    [timestampInput.value, fullName, email, phone, birthDate, terms ? "yes" : "no"].forEach(val => {
      const cell = document.createElement("td");
      cell.textContent = val;
      cell.classList.add("p-2");
      newRow.appendChild(cell);
    });

    tableBody.appendChild(newRow);
    form.reset();
    updateTimestamp();
  });
});

// script.js
// Author: Carolyn Ott
// Date: 2025-10-30
// Handles custom validation and table row insertion

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addCourseForm");
  const tableBody = document.querySelector("#timetable");
  const timestampInput = document.getElementById("timestamp");

  const updateTimestamp = () => {
    const now = new Date();
    timestampInput.value = now.toISOString();
  };
  updateTimestamp();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateTimestamp();

    // Clear previous errors
    document.querySelectorAll("p[id$='Error']").forEach(el => el.textContent = "");

    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const birthDate = form.birthDate.value;
    const terms = form.terms.checked;

    let valid = true;

    // Name
    const nameParts = fullName.split(/\s+/);
    if (nameParts.length < 2 || nameParts.some(p => p.length < 2)) {
      valid = false;
      document.getElementById("nameError").textContent =
        "Please enter your full name (first and last, at least 2 letters each).";
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      valid = false;
      document.getElementById("emailError").textContent =
        "Please enter a valid email address.";
    }

    // Phone
    const phonePattern = /^\+358\d{7,10}$/;
    if (!phonePattern.test(phone)) {
      valid = false;
      document.getElementById("phoneError").textContent =
        "Please enter a valid Finnish number (+358 followed by 7–10 digits).";
    }

    // Birth Date
    if (!birthDate) {
      valid = false;
      document.getElementById("birthError").textContent = "Please choose your birth date.";
    } else {
      const birth = new Date(birthDate);
      const today = new Date();
      if (birth > today) {
        valid = false;
        document.getElementById("birthError").textContent = "Birth date cannot be in the future.";
      } else {
        const age = today.getFullYear() - birth.getFullYear();
        if (age < 13 || (age === 13 && today < new Date(birth.setFullYear(birth.getFullYear() + 13)))) {
          valid = false;
          document.getElementById("birthError").textContent = "You must be at least 13 years old.";
        }
      }
    }

    // Terms
    if (!terms) {
      valid = false;
      document.getElementById("termsError").textContent =
        "You must accept the terms before submitting.";
    }

    if (!valid) return;

    // Add new row
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

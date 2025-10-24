//script.js
// Author: Carolyn ott 
// Date: 2025-10-24
// Handles custom validation and table row insertion

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addCourseForm");
    const tableBody = document.querySelector("#timetable tbody");
    const timestampInput = document.getElementById("timestamp");

    // Fill hidden timestamp automatically
    const updateTimestamp = () => {
        const now = new Date();
        timestampInput.value = now.toISOString();
    };
    updateTimestamp();
    
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        updateTimestamp();

      // Clear previous errors
        document.querySelectorAll(".error").forEach(el => el.textContent = "");
    
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
    
      // Validate email (simple regex)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
        valid = false;
        document.getElementById("emailError").textContent =
            "Please enter a valid email address (e.g., name@example.com).";
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
          // Optional: must be 13+
            const age = today.getFullYear() - birth.getFullYear();
            if (age < 13 || (age === 13 && today < new Date(birth.setFullYear(birth.getFullYear() + 13)))) {
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
    
      if (!valid) return; // Stop if any invalid
    
      // If valid → add a new row
        const newRow = document.createElement("tr");
        [timestampInput.value, fullName, email, phone, birthDate].forEach(val => {
        const cell = document.createElement("td");
        cell.textContent = val;
        newRow.appendChild(cell);
        });
    
        tableBody.appendChild(newRow);
        form.reset();
        updateTimestamp();
    });
    });
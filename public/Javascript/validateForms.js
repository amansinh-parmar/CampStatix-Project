// =============== Client-Side Form Validation Script ===============
// This script uses Bootstrap's validation classes to prevent form submission
// if the form has invalid fields, and gives visual feedback to the user.

// Immediately Invoked Function Expression (IIFE) to avoid polluting global scope
(() => {
  "use strict"; // Enforce stricter parsing and error handling in JavaScript

  bsCustomFileInput.init();
  // Select all forms that need Bootstrap custom validation
  const forms = document.querySelectorAll(".validated-form");

  // Loop through each form and apply a 'submit' event listener
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        // Check if form is invalid
        if (!form.checkValidity()) {
          event.preventDefault(); // Stop form from submitting
          event.stopPropagation(); // Stop the event from bubbling up
        }

        // Add Bootstrap class to show validation feedback (green/red borders, messages)
        form.classList.add("was-validated");
      },
      false // Use event capturing = false (default bubbling phase)
    );
  });
})();

// =============== Optional Alert for Debugging ===============
// This was likely used for testing. You can uncomment for quick debugging.
// alert("THIS IS AN ALERT MESSAGE FROM PUBLIC DIRECTORY!!");

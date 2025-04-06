import EmberObject from "@ember/object";
import { withPluginApi } from "discourse/lib/plugin-api";
import { i18n } from "discourse-i18n";

export default {
  name: "user-field-validation",
  initialize() {
    withPluginApi("1.33.0", (api) => {
      api.addCustomUserFieldValidationCallback((userField) => {
        if (
          userField.field.has_custom_validation &&
          userField.field.value_validation_regex &&
          userField.value
        ) {
          if (
            !new RegExp(userField.field.value_validation_regex).test(
              userField.value
            )
          ) {
            return EmberObject.create({
              failed: true,
              reason: i18n(
                "discourse_authentication_validations.value_validation_error_message",
                {
                  user_field_name: userField.field.name,
                }
              ),
              element: userField.field.element,
            });
          }
        }
      });

      api.onPageChange(() => {
        const fieldValidations = [
          {
            selector: '.user-field-name input',
            errorMessage: "Name must be between 2 and 50 characters.",
            regex: /^[a-zA-Z][a-zA-Z\s\-'.]{1,49}$/,
          },
          {
            selector: '.user-field-company input',
            errorMessage: "Company name must be between 2 and 100 characters.",
            regex: /^[a-zA-Z0-9][a-zA-Z0-9\s\-&,\.]{1,99}$/,
          },
          {
            selector: '.user-field-title input',
            errorMessage: "Title must be between 2 and 50 characters.",
            regex: /^[a-zA-Z0-9][a-zA-Z0-9\s\-\/.&]{1,49}$/,
          },
          {
            selector: '.user-field-linkedin-profile input',
            errorMessage: "Enter a valid LinkedIn profile URL.",
            regex: /^https:\/\/((www|[a-z]{2,3})\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+\/?$/,
          },
        ];

        fieldValidations.forEach(({ selector, errorMessage, regex }) => {
          const inputField = document.querySelector(selector);
          if (!inputField) {
            return;
          }

          // Skip if already processed
          if (inputField.dataset.validationAttached === "true") {
            return;
          }

          // Create error message container
          const errorElement = document.createElement("div");
          errorElement.classList.add("tip", "bad", "validation-message");
          errorElement.style.display = "none";

          // SVG error icon (Discourse xmark)
          const iconElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          iconElement.setAttribute("class", "fa d-icon d-icon-xmark svg-icon svg-string");
          const useElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
          useElement.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#xmark");
          iconElement.appendChild(useElement);

          // Add icon + error text
          errorElement.appendChild(iconElement);
          errorElement.appendChild(document.createTextNode(` ${errorMessage}`));

          // Append error message to controls container
          const container = inputField.closest(".controls");
          if (container) {
            container.appendChild(errorElement);
          }

          // Attach input listener (only once)
          inputField.addEventListener("input", () => {
            const value = inputField.value.trim();
            if (value.length > 0 && !regex.test(value)) {
              errorElement.style.display = "block";
            } else {
              errorElement.style.display = "none";
            }
          });

          // Mark as processed
          inputField.dataset.validationAttached = "true";
        });
      });
    });
  },
};

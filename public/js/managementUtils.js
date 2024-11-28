import { sessionValidation } from "./sessionCheck.js";

// fetch tab data
export async function fetchTabData(content, route) {
  const response = await fetch(route);
  await sessionValidation(response);

  document.querySelector(`#${content}-content`).innerHTML =
    await response.text();

  const dataResponse = await fetch(`${route}/data`);
  if (!dataResponse.ok) throw new Error(`Failed to load ${content} content`);

  return await dataResponse.json();
}

// clean up modal backdrops
export function cleanUpModalBackdrops() {
  document
    .querySelectorAll(".modal-backdrop")
    .forEach((backdrop) => backdrop.remove());
  document.body.classList.remove("modal-open");
  document.body.style.paddingRight = "";
  document.body.style.overflow = "";
}

// display notification
export function showNotification(message, type) {
  const alertContainer = document.createElement("div");
  alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
  alertContainer.role = "alert";
  alertContainer.innerHTML = `
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

  document
    .getElementById("adminTabs")
    .insertAdjacentElement("beforebegin", alertContainer);

  setTimeout(() => {
    alertContainer.classList.remove("show");
    alertContainer.addEventListener("transitionend", () =>
      alertContainer.remove()
    );
  }, 3000);
}

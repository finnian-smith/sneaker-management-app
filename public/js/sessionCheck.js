export async function sessionValidation(response) {
  try {
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.setItem(
          "sessionMessage",
          "Session has expired. Please log in to continue."
        );
        window.location.href = "/admin";
        return;
      }
      throw new Error("Failed to execute request");
    }
  } catch (error) {
    console.error("Error with fetch:", error);
    window.location.href = "/admin";
  }
}

export function sessionExpiredNotification() {
  const message = localStorage.getItem("sessionMessage");
  if (message) {
    const alertContainer = document.createElement("div");
    alertContainer.className = `alert alert-warning alert-dismissible fade show`;
    alertContainer.role = "alert";
    alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

    document
      .querySelector(".d-flex.justify-content-center")
      .insertAdjacentElement("beforebegin", alertContainer);

    setTimeout(() => {
      alertContainer.classList.remove("show");
      alertContainer.addEventListener("transitionend", () =>
        alertContainer.remove()
      );
    }, 5000);

    localStorage.removeItem("sessionMessage");
  }
}

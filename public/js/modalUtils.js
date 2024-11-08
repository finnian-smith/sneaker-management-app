// helper function to clean up modal backdrops
function cleanUpModalBackdrops() {
  document
    .querySelectorAll(".modal-backdrop")
    .forEach((backdrop) => backdrop.remove());
  document.body.classList.remove("modal-open");
  document.body.style.paddingRight = "";
  document.body.style.overflow = "";
}

// listen for modal show and hide events
document.addEventListener("DOMContentLoaded", () => {
  // Listen for all modals to be shown
  document.body.addEventListener("show.bs.modal", () => {
    cleanUpModalBackdrops();
  });

  // listen for all modals to be hidden
  document.body.addEventListener("hidden.bs.modal", () => {
    cleanUpModalBackdrops();
  });
});

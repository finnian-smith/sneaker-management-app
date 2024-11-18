import {
  createCategoryCard,
  createEditCategoryModal,
  createDeleteCategoryModal,
} from "./categoryCard.js";

const categoryTab = document.getElementById("category-tab");

// initialise listeners only once for "category-tab" shown event
if (categoryTab) {
  loadCategoryContent();

  // listeners to load content whenever category-tab is shown or clicked
  categoryTab.addEventListener("shown.bs.tab", loadCategoryContent);
  categoryTab.addEventListener("click", loadCategoryContent);
}

// load category content on tab click
async function loadCategoryContent() {
  cleanUpModalBackdrops();

  try {
    // fetch category management page
    const response = await fetch("/admin/category-management");
    if (!response.ok) throw new Error("Failed to load content");

    // load fetched HTML content
    document.getElementById("category-content").innerHTML =
      await response.text();

    // fetch data for categories
    const dataResponse = await fetch("/admin/category-management/data");
    if (!dataResponse.ok) throw new Error("Failed to load categories");

    const data = await dataResponse.json();
    const categoriesContainer = document.getElementById("categoriesContainer");

    // render items if categoriesContainer is available
    if (categoriesContainer) {
      renderCategories(data.categories);
    } else {
      console.error("categoriesContainer not found");
    }
  } catch (error) {
    console.error("Error loading content or categories:", error);
  } finally {
    cleanUpModalBackdrops();
  }
}

// render categories and setup modals dynamically
function renderCategories(categories) {
  const categoriesContainer = document.getElementById("categoriesContainer");
  categoriesContainer.innerHTML = "";

  if (categories.length === 0) {
    categoriesContainer.innerHTML = "<p>No categories found.</p>";
    return;
  }

  const categoryRow = document.createElement("div");
  categoryRow.classList.add("row");
  categoriesContainer.appendChild(categoryRow);

  categories.forEach((category) => {
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("col-md-4");

    categoryElement.innerHTML = `
        ${createCategoryCard(category)}
        ${createEditCategoryModal(category)}
        ${createDeleteCategoryModal(category)}
      `;
    categoryRow.appendChild(categoryElement);
  });

  setupCategoryFormListeners();
}

function setupCategoryFormListeners() {
  // add category form listener
  const addCategoryForm = document.querySelector("#addCategoryModal form");
  if (addCategoryForm) {
    addCategoryForm.removeEventListener("submit", handleAddCategorySubmit);
    addCategoryForm.addEventListener("submit", handleAddCategorySubmit);
  }

  // edit category form listeners
  document.querySelectorAll(".edit-category-form").forEach((form) => {
    form.removeEventListener("submit", handleEditCategorySubmit);
    form.addEventListener("submit", handleEditCategorySubmit);
  });

  // delete category form listeners
  document.querySelectorAll(".delete-category-form").forEach((form) => {
    form.removeEventListener("submit", handleDeleteCategorySubmit);
    form.addEventListener("submit", handleDeleteCategorySubmit);
  });
}

// handle add category form submission
async function handleAddCategorySubmit(event) {
  event.preventDefault();

  const addCategoryForm = event.target;
  const formData = new FormData(addCategoryForm);

  try {
    const response = await fetch(addCategoryForm.action, {
      method: addCategoryForm.method,
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to add category");

    const data = await response.json();

    if (data.success) {
      renderCategories(data.categories);
      showNotification(data.message, "success");
    } else {
      showNotification("Failed to add category", "danger");
    }
  } catch (error) {
    console.error("Error submitting add category form:", error);
    showNotification("An error occurred while adding the category.", "danger");
  } finally {
    cleanUpModalBackdrops();
    addCategoryModal.classList.remove("show");
    addCategoryModal.style.display = "none";
    addCategoryForm.reset();
  }
}

// handle edit category form submission
async function handleEditCategorySubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to edit category");

    const data = await response.json();
    if (data.success) {
      renderCategories(data.categories);
      showNotification(data.message, "success");
    } else {
      showNotification("Failed to edit category", "danger");
    }
  } catch (error) {
    console.error("Error submitting edit form:", error);
    showNotification("An error occurred while editing the category.", "danger");
  } finally {
    cleanUpModalBackdrops();
  }
}

// handle delete category form submission
async function handleDeleteCategorySubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const enteredName = formData.get("confirmationName")?.trim();
  const expectedName = form.dataset.categoryName;

  let errorMessage = form.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }

  if (enteredName !== expectedName) {
    errorMessage = document.createElement("p");
    errorMessage.textContent = "Entered name does not match the category name.";
    errorMessage.className = "error-message text-danger mt-2";

    const inputField = form.querySelector('input[name="confirmationName"]');
    inputField.insertAdjacentElement("afterend", errorMessage);
    return;
  }

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to delete category");

    const data = await response.json();
    if (data.success) {
      renderCategories(data.categories);
      showNotification(data.message, "success");
    } else {
      showNotification("Failed to delete category", "danger");
    }
  } catch (error) {
    console.error("Error submitting delete form:", error);
    showNotification(
      "An error occurred while deleting the category.",
      "danger"
    );
  } finally {
    cleanUpModalBackdrops();
  }
}

// clean up modal backdrops
function cleanUpModalBackdrops() {
  document
    .querySelectorAll(".modal-backdrop")
    .forEach((backdrop) => backdrop.remove());
  document.body.classList.remove("modal-open");
  document.body.style.paddingRight = "";
  document.body.style.overflow = "";
}

// display notification
function showNotification(message, type) {
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

// initialise form listeners
setupCategoryFormListeners();

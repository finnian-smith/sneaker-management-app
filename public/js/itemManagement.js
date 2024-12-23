import {
  createItemCard,
  createEditItemModal,
  createDeleteItemModal,
} from "./itemCard.js";
import {
  fetchTabData,
  cleanUpModalBackdrops,
  showNotification,
} from "./managementUtils.js";
import { sessionValidation } from "./sessionCheck.js";

const itemTab = document.getElementById("item-tab");

// initialise listeners only once for "item-tab" shown event
if (itemTab) {
  itemTab.addEventListener("shown.bs.tab", async function () {
    itemTab.addEventListener("click", loadItemContent);
  });
}

// load item content on tab click
async function loadItemContent() {
  cleanUpModalBackdrops();

  try {
    const data = await fetchTabData("item", "/admin/item-management");
    const itemsContainer = document.querySelector("#itemsContainer");

    // render items if itemsContainer is available
    if (itemsContainer) {
      renderItems(data.items, data.categories, { isAdmin: true });
    } else {
      console.error("itemsContainer not found");
    }
  } catch (error) {
    console.error("Error loading content or items:", error);
  } finally {
    cleanUpModalBackdrops();
  }
}

// render items and setup modals dynamically
function renderItems(items, categories, options = { isAdmin: false }) {
  const itemsContainer = document.getElementById("itemsContainer");
  itemsContainer.innerHTML = "";

  if (items.length === 0) {
    itemsContainer.innerHTML = "<p>No items found.</p>";
    return;
  }

  const itemRow = document.createElement("div");
  itemRow.classList.add("row");
  itemsContainer.appendChild(itemRow);

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("col-md-12", "col-lg-6", "d-flex");

    itemElement.innerHTML = `
          ${createItemCard(item, options)}
          ${options.isAdmin ? createEditItemModal(item, categories) : ""}
          ${options.isAdmin ? createDeleteItemModal(item) : ""}
        `;
    itemRow.appendChild(itemElement);
  });

  setupItemFormListeners();
}

// clear and reattach form listeners
function setupItemFormListeners() {
  // add item form listener
  const addItemForm = document.querySelector("#addItemModal form");
  if (addItemForm) {
    addItemForm.removeEventListener("submit", handleAddItemSubmit);
    addItemForm.addEventListener("submit", handleAddItemSubmit);
  }

  // search form listener
  const searchForm = document.querySelector("#searchForm");
  if (searchForm) {
    searchForm.removeEventListener("submit", handleSearchItemSubmit);
    searchForm.addEventListener("submit", handleSearchItemSubmit);
  }

  // edit item form listeners
  document.querySelectorAll(".edit-item-form").forEach((form) => {
    form.removeEventListener("submit", handleEditItemSubmit);
    form.addEventListener("submit", handleEditItemSubmit);
  });

  // delete item form listeners
  document.querySelectorAll(".delete-item-form").forEach((form) => {
    form.removeEventListener("submit", handleDeleteItemSubmit);
    form.addEventListener("submit", handleDeleteItemSubmit);
  });
}

// handle add item form submission
async function handleAddItemSubmit(event) {
  event.preventDefault();

  const addItemForm = event.target;
  const formData = new FormData(addItemForm);

  try {
    const response = await fetch(addItemForm.action, {
      method: addItemForm.method,
      body: formData,
    });

    // if (!response.ok) throw new Error("Failed to add item");
    await sessionValidation(response);

    const data = await response.json();
    if (data.success) {
      renderItems(data.items, data.categories, { isAdmin: true });
      showNotification(data.message, "success");
    } else {
      showNotification("Failed to add item", "danger");
    }
  } catch (error) {
    console.error("Error submitting add item form:", error);
    showNotification("An error occurred while adding the item.", "danger");
  } finally {
    cleanUpModalBackdrops();
    addItemModal.classList.remove("show");
    addItemModal.style.display = "none";
    addItemForm.reset();
  }
}

// handle search form submission
async function handleSearchItemSubmit(event) {
  event.preventDefault();

  const query = document.getElementById("search").value.trim();

  try {
    const response = await fetch(
      `/admin/item-management/search?search=${encodeURIComponent(query)}`
    );

    // if (!response.ok) throw new Error("Failed to fetch search results");
    await sessionValidation(response);

    const data = await response.json();

    renderItems(data.items, data.categories, { isAdmin: true });
  } catch (error) {
    console.error("Error fetching items:", error);
    document.getElementById("itemsContainer").innerHTML =
      "<p>Error fetching items. Please try again.</p>";
  }
}

// handle edit item form submission
async function handleEditItemSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
    });

    // if (!response.ok) throw new Error("Failed to edit item");
    await sessionValidation(response);

    const data = await response.json();
    if (data.success) {
      renderItems(data.items, data.categories, { isAdmin: true });
      showNotification(data.message, "success");
    } else {
      showNotification("Failed to edit item", "danger");
    }
  } catch (error) {
    console.error("Error submitting edit form:", error);
    showNotification("An error occurred while editing the item.", "danger");
  } finally {
    cleanUpModalBackdrops();
  }
}

// handle delete item form submission
async function handleDeleteItemSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const enteredName = formData.get("confirmationName")?.trim();
  const expectedName = form.dataset.itemName;

  let errorMessage = form.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }

  if (enteredName !== expectedName) {
    errorMessage = document.createElement("p");
    errorMessage.textContent = "Entered name does not match the item name.";
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

    // if (!response.ok) throw new Error("Failed to delete item");
    await sessionValidation(response);

    const data = await response.json();
    if (data.success) {
      renderItems(data.items, data.categories, { isAdmin: true });
      showNotification(data.message, "success");
    } else {
      showNotification("Failed to delete item", "danger");
    }
  } catch (error) {
    console.error("Error submitting delete form:", error);
    showNotification("An error occurred while deleting the item.", "danger");
  } finally {
    cleanUpModalBackdrops();
  }
}

// initialise form listeners
setupItemFormListeners();

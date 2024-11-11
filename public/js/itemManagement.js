import {
  createItemCard,
  createEditItemModal,
  createDeleteItemModal,
} from "./itemCard.js";

document
  .getElementById("item-tab")
  .addEventListener("shown.bs.tab", async function () {
    // click event listener on item-tab
    document.getElementById("item-tab").addEventListener("click", async () => {
      cleanUpModalBackdrops();

      try {
        // fetch the item management page
        const response = await fetch("/admin/item-management");
        if (!response.ok) {
          throw new Error("Failed to load content");
        }

        // get HTML content from the response
        const html = await response.text();

        // load the fetched HTML into the item-content div
        document.getElementById("item-content").innerHTML = html;

        // clean up modal backdrops
        cleanUpModalBackdrops();

        // fetch data
        const dataResponse = await fetch("/admin/item-management/data");
        if (!dataResponse.ok) {
          throw new Error("Failed to load items");
        }

        const data = await dataResponse.json();

        const itemsContainer = document.getElementById("itemsContainer");

        // Only render items if itemsContainer is available
        if (itemsContainer) {
          renderItems(data.items, data.categories);
        } else {
          console.error("itemsContainer not found");
        }
      } catch (error) {
        console.error("Error loading content or items:", error);
      }
    });
  });

// render items and set up modals dynamically
function renderItems(items, categories) {
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
        ${createItemCard(item)}
        ${createEditItemModal(item, categories)}
        ${createDeleteItemModal(item)}
      `;
    itemRow.appendChild(itemElement);
  });

  // reattach event listeners after modals and items are re-rendered
  setupFormListeners();
}

// setup form listeners and handle response
function setupFormListeners() {
  // edit form
  document.querySelectorAll(".edit-item-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to edit item");

        const data = await response.json();
        if (data.success) {
          renderItems(data.items, data.categories);
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
    });
  });

  // delete form
  document.querySelectorAll(".delete-item-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to delete item");

        const data = await response.json();
        if (data.success) {
          renderItems(data.items, data.categories);
          showNotification(data.message, "success");
        } else {
          showNotification("Failed to delete item", "danger");
        }
      } catch (error) {
        console.error("Error submitting delete form:", error);
        showNotification(
          "An error occurred while deleting the item.",
          "danger"
        );
      } finally {
        cleanUpModalBackdrops();
      }
    });
  });

  // search form
  document
    .getElementById("searchForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const query = document.getElementById("search").value.trim();
      if (!query) return; // query == empty -> don't search

      try {
        const response = await fetch(
          `/admin/item-management/search?search=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Failed to fetch search results");

        const data = await response.json();
        renderItems(data.items, data.categories);
      } catch (error) {
        console.error("Error fetching items:", error);
        document.getElementById("itemsContainer").innerHTML =
          "<p>Error fetching items. Please try again.</p>";
      }
    });
}

// call setUpFormListeners
setupFormListeners();

// remove modal backdrops and reset body class (used elsewhere so maybe import???)
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

  // auto-dismiss notification after 3 seconds
  setTimeout(() => {
    alertContainer.classList.remove("show");
    alertContainer.addEventListener("transitionend", () =>
      alertContainer.remove()
    );
  }, 3000);
}

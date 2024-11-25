import {
  createItemCard,
  createEditItemModal,
  createDeleteItemModal,
} from "./itemCard.js";

document.addEventListener("DOMContentLoaded", () => {
  // search form listener
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.removeEventListener("submit", handleSearchItemSubmit);
    searchForm.addEventListener("submit", handleSearchItemSubmit);
  }
});

// render items and setup modals dynamically
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

  // setupItemFormListeners();
}

// handle search form submission
async function handleSearchItemSubmit(event) {
  event.preventDefault();

  const query = document.getElementById("search").value.trim();

  try {
    const response = await fetch(
      `/items/search?search=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    renderItems(data.items, data.categories);
  } catch (error) {
    console.error("Error fetching items:", error);
    document.getElementById("itemsContainer").innerHTML =
      "<p>Error fetching items. Please try again.</p>";
  }
}

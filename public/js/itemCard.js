export function createItemCard(item) {
  return `
    <div class="card mb-3 item-card">
      <div class="row g-0">
        <div class="col-md-6">
          <img src="${item.image_url}" alt="${item.name}" />
        </div>
        <div class="col-md-6">
          <div class="card-body">
            <p class="card-text category-tag"
               style="background-color: ${item.category_tag}"
            >
               ${item.category_name}
            </p>
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">${item.brand}</p>
            <p class="card-text">€${item.price}</p>
            <p class="card-text">
              <small class="text-body-secondary">Available Sizes: ${item.size}</small>
            </p>
            <div class="btn-container">
              <button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#editItemModal-${item.id}">Edit</button>
              <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteItemModal-${item.id}">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function createEditItemModal(item, categories) {
  return `
      <div class="modal fade" id="editItemModal-${
        item.id
      }" tabindex="-1" aria-labelledby="editItemModalLabel-${
    item.id
  }" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editItemModalLabel-${item.id}">
                Edit Item: ${item.name}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form action="/admin/item-management/edit/${
                item.id
              }" method="POST" class="edit-item-form" data-id="${item.id}">
                <div class="mb-3">
                  <label for="category_id-${
                    item.id
                  }" class="form-label">Category</label>
                  <select name="category_id" id="category_id-${
                    item.id
                  }" class="form-control" required>
                    ${categories
                      .map(
                        (category) => `
                      <option value="${category.id}" ${
                          category.id === item.category_id ? "selected" : ""
                        }>${category.name}</option>
                    `
                      )
                      .join("")}
                  </select>
                </div>
                
                <div class="mb-3">
                  <label for="itemName-${
                    item.id
                  }" class="form-label">Name</label>
                  <input type="text" class="form-control" name="name" id="itemName-${
                    item.id
                  }" value="${item.name}" required />
                </div>
  
                <div class="mb-3">
                  <label for="itemBrand-${
                    item.id
                  }" class="form-label">Brand</label>
                  <input type="text" class="form-control" name="brand" id="itemBrand-${
                    item.id
                  }" value="${item.brand}" required />
                </div>
  
                <div class="mb-3">
                  <label for="itemPrice-${
                    item.id
                  }" class="form-label">Price</label>
                  <input type="number" class="form-control" name="price" id="itemPrice-${
                    item.id
                  }" value="${item.price}" required />
                </div>
  
                <div class="mb-3">
                  <label for="itemStock-${
                    item.id
                  }" class="form-label">Stock</label>
                  <input type="number" class="form-control" name="stock_quantity" id="itemStock-${
                    item.id
                  }" value="${item.stock_quantity}" required />
                </div>
  
                <div class="mb-3">
                  <label for="itemSize-${
                    item.id
                  }" class="form-label">Size</label>
                  <input type="text" class="form-control" name="size" id="itemSize-${
                    item.id
                  }" value="${item.size}" required />
                </div>

                <div class="mb-3">
                  <label for="itemImageURL-${
                    item.id
                  }" class="form-label">Image URL</label>
                  <input type="text" class="form-control" name="imageURL" id="itemImageURL-${
                    item.id
                  }" value="${item.image_url}" required />
                </div>
  
                <button type="submit" class="btn btn-primary">Submit Edit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
}

export function createDeleteItemModal(item) {
  return `
      <div class="modal fade" id="deleteItemModal-${item.id}" tabindex="-1" aria-labelledby="deleteItemModalLabel-${item.id}" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteItemModalLabel-${item.id}">
                Delete Item: ${item.name}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>
                Are you sure you want to delete this item? Enter the item name "${item.name}" to confirm:
              </p>
              <form
                action="/admin/item-management/delete/${item.id}"
                method="POST"
                class="delete-item-form"
                data-id="${item.id}"
                data-item-name="${item.name}"
              >
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control"
                    name="confirmationName"
                    placeholder="Enter item name"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-danger">Confirm Delete</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
}

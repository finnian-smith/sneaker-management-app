export function createCategoryCard(category) {
  return `
      <div
          class="card mb-4 shadow category-card ${category.name.toLowerCase()}-card"
          style="background-image: url(${category.image_url})">
        <div class="overlay"></div>
        <div class="card-body">
          <h5 class="card-title">${category.name}</h5>
          <p class="card-text">${category.description}</p>
          
          <button 
            class="btn btn-dark" 
            data-bs-toggle="modal" 
            data-bs-target="#editCategoryModal-${category.id}">
            Edit
          </button>
          
          <button 
            class="btn btn-danger" 
            data-bs-toggle="modal" 
            data-bs-target="#deleteCategoryModal-${category.id}">
            Delete
          </button>
        </div>
      </div>
    `;
}

export function createEditCategoryModal(category) {
  return `
      <div class="modal fade" id="editCategoryModal-${category.id}" tabindex="-1" aria-labelledby="editCategoryModalLabel-${category.id}" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editCategoryModalLabel-${category.id}">
                Edit Category: ${category.name}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form action="/admin/category-management/edit/${category.id}" method="POST" class="edit-category-form" data-id="${category.id}">
                <div class="mb-3">
                  <label for="categoryName-${category.id}" class="form-label">Category Name</label>
                  <input type="text" class="form-control" name="name" id="categoryName-${category.id}" value="${category.name}" required />
                </div>
                
                <div class="mb-3">
                  <label for="categoryDescription-${category.id}" class="form-label">Description</label>
                  <input type="text" class="form-control" name="description" id="categoryDescription-${category.id}" value="${category.description}" required />
                </div>

                <div class="mb-3">
                  <label for="image_url" class="form-label">Image URL</label>
                  <input type="text" name="image_url" id="categoryImageURL-${category.id}" value="${category.image_url}" class="form-control" required />
                </div>

                <div class="mb-3">
                  <label for="tag_color" class="form-label">Tag Color</label>
                  <input type="color" name="tag_color" id="categoryTagColor-${category.id}" value="${category.tag_color}" class="form-control" required />
                </div>
                
                <button type="submit" class="btn btn-primary">Submit Edit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
}

export function createDeleteCategoryModal(category) {
  return `
      <div class="modal fade" id="deleteCategoryModal-${category.id}" tabindex="-1" aria-labelledby="deleteCategoryModalLabel-${category.id}" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deleteCategoryModalLabel-${category.id}">
                Delete Category: ${category.name}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>
                Are you sure you want to delete this category? Enter the category name "${category.name}" to confirm:
              </p>
              <form action="/admin/category-management/delete/${category.id}" method="POST" class="delete-category-form" data-id="${category.id}">
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control"
                    name="confirmationName"
                    placeholder="Enter category name"
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

import { pool } from "./pool.js";

const db = {
  // category management
  async getAllCategories() {
    try {
      const { rows } = await pool.query("SELECT * FROM category");
      return rows;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Could not fetch categories");
    }
  },

  async getCategoryById(id) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM category WHERE id = $1`,
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error("Error fetching category:", error);
      throw new Error("Could not fetch category");
    }
  },

  async addCategory(name, description, image_url, tag_color) {
    try {
      await pool.query(
        "INSERT INTO category (name, description, image_url, tag_color) VALUES ($1, $2, $3, $4)",
        [name, description, image_url, tag_color]
      );
    } catch (error) {
      console.error("Error inserting category:", error);
      throw new Error("Could not insert category");
    }
  },

  async editCategory(id, name, description, image_url, tag_color) {
    try {
      const { rows } = await pool.query(
        "SELECT name, description, image_url, tag_color FROM category WHERE id = $1",
        [id]
      );

      if (rows.length === 0) {
        throw new Error("Category not found");
      }

      const existingCategory = rows[0];
      const updatedName = name || existingCategory.name;
      const updatedDescription = description || existingCategory.description;
      const updatedImageURL = image_url || existingCategory.image_url;
      const updatedTagColor = tag_color || existingCategory.tag_color;

      await pool.query(
        `UPDATE category SET
        name = $2,
        description = $3,
        image_url = $4,
        tag_color = $5
        WHERE id = $1`,
        [id, updatedName, updatedDescription, updatedImageURL, updatedTagColor]
      );
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error("Could not update category");
    }
  },

  async deleteCategory(id) {
    try {
      await pool.query("DELETE FROM category WHERE id = $1", [id]);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("Could not delete category");
    }
  },

  // item management
  async getAllItems(limit = 10, offset = 0) {
    try {
      const { rows } = await pool.query(
        `SELECT item.*, category.name AS category_name, category.tag_color AS category_tag
        FROM item
        INNER JOIN category ON item.category_id = category.id
        LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return rows;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw new Error("Could not fetch items");
    }
  },

  async getItemById(id) {
    try {
      const { rows } = await pool.query(
        `SELECT item.*, category.name AS category_name, category.tag_color AS category_tag
        FROM item
        INNER JOIN category ON item.category_id = category.id
        WHERE item.id = $1`,
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error("Error fetching item:", error);
      throw new Error("Could not fetch item");
    }
  },

  async getItemsByCategoryId(id) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM item WHERE category_id = $1`,
        [id]
      );
      return rows;
    } catch (error) {
      console.error("Error fetching items:", error);
      throw new Error("Could not fetch items");
    }
  },

  async getItemsBySearch(query, limit = 10, offset = 0) {
    const sqlQuery = `
    SELECT item.*, category.name AS category_name, category.tag_color AS category_tag
    FROM item 
    INNER JOIN category ON item.category_id = category.id 
    WHERE item.name ILIKE $1 
       OR item.brand ILIKE $1 
       OR category.name ILIKE $1
    LIMIT $2 OFFSET $3
  `;
    const values = [`%${query}%`, limit, offset];

    try {
      const { rows } = await pool.query(sqlQuery, values);
      return rows;
    } catch (error) {
      console.error(`Error executing search query:`, error);
      throw new Error("Could not fetch items");
    }
  },

  async addItem(
    name,
    brand,
    price,
    stock_quantity,
    category_id,
    size,
    image_url
  ) {
    try {
      await pool.query(
        `INSERT INTO item (name, brand, price, stock_quantity, category_id, size, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [name, brand, price, stock_quantity, category_id, size, image_url]
      );
    } catch (error) {
      console.error("Error inserting item:", error);
      throw new Error("Could not insert item");
    }
  },

  async editItem(
    id,
    name,
    brand,
    price,
    stock_quantity,
    category_id,
    size,
    image_url
  ) {
    try {
      const { rows } = await pool.query("SELECT * FROM item WHERE id = $1", [
        id,
      ]);

      if (rows.length === 0) {
        throw new Error("Item not found");
      }

      const existingItem = rows[0];
      const updatedName = name || existingItem.name;
      const updatedBrand = brand || existingItem.brand;
      const updatedPrice = price || existingItem.price;
      const updatedStock = stock_quantity || existingItem.stock_quantity;
      const updatedCategoryId = category_id || existingItem.category_id;
      const updatedSize = size || existingItem.size;
      const updatedImageURL = image_url || existingItem.image_url;

      await pool.query(
        `UPDATE item SET
        name = $2,
        brand = $3,
        price = $4,
        stock_quantity = $5,
        category_id = $6,
        size = $7,
        image_url = $8
        WHERE id = $1`,
        [
          id,
          updatedName,
          updatedBrand,
          updatedPrice,
          updatedStock,
          updatedCategoryId,
          updatedSize,
          updatedImageURL,
        ]
      );
    } catch (error) {
      console.error("Error updating item:", error);
      throw new Error("Could not update item");
    }
  },

  async deleteItem(id) {
    try {
      await pool.query("DELETE FROM item WHERE id = $1", [id]);
    } catch (error) {
      console.error("Error deleting item:", error);
      throw new Error("Could not delete item");
    }
  },
};

export default db;

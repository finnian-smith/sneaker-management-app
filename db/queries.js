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
      return rows[0]; // Return the category object
    } catch (error) {
      console.error("Error fetching category:", error);
      throw new Error("Could not fetch category");
    }
  },

  async addCategory(name, description) {
    try {
      await pool.query(
        "INSERT INTO category (name, description) VALUES ($1, $2)",
        [name, description]
      );
    } catch (error) {
      console.error("Error inserting category:", error);
      throw new Error("Could not insert category");
    }
  },

  async editCategory(id, name, description) {
    try {
      const { rows } = await pool.query(
        "SELECT name, description FROM category WHERE id = $1",
        [id]
      );

      if (rows.length === 0) {
        throw new Error("Category not found");
      }

      const existingCategory = rows[0];
      const updatedName = name || existingCategory.name;
      const updatedDescription = description || existingCategory.description;

      await pool.query(
        "UPDATE category SET name = $2, description = $3 WHERE id = $1",
        [id, updatedName, updatedDescription]
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
        `SELECT item.*, category.name AS category_name
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

  async getItemsBySearch(query, searchType, limit = 10, offset = 0) {
    let sqlQuery;
    let values;

    switch (searchType) {
      case "category":
        sqlQuery = `
          SELECT item.*, category.name AS category_name 
          FROM item 
          INNER JOIN category ON item.category_id = category.id 
          WHERE category.id = $1 OR category.name ILIKE $2
          LIMIT $3 OFFSET $4
        `;
        values = [query, `%${query}%`, limit, offset];
        break;

      case "brand":
        sqlQuery = `
          SELECT item.*, category.name AS category_name 
          FROM item 
          INNER JOIN category ON item.category_id = category.id
          WHERE brand ILIKE $1 
          LIMIT $2 OFFSET $3
        `;
        values = [`%${query}%`, limit, offset];
        break;

      case "size":
        sqlQuery = `
          SELECT item.*, category.name AS category_name 
          FROM item 
          INNER JOIN category ON item.category_id = category.id
          WHERE size LIKE $1 
          LIMIT $2 OFFSET $3
        `;
        values = [`%${query}%`, limit, offset];
        break;

      default:
        throw new Error(
          "Invalid search type. Must be 'category', 'brand', or 'size'."
        );
    }

    try {
      const { rows } = await pool.query(sqlQuery, values);
      return rows;
    } catch (error) {
      console.error(`Error executing '${searchType}' search query:`, error);
      throw new Error("Could not fetch items");
    }
  },

  async addItem(name, brand, price, stock_quantity, category_id, size) {
    try {
      await pool.query(
        `INSERT INTO item (name, brand, price, stock_quantity, category_id, size)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [name, brand, price, stock_quantity, category_id, size]
      );
    } catch (error) {
      console.error("Error inserting item:", error);
      throw new Error("Could not insert item");
    }
  },

  async editItem(id, name, brand, price, stock_quantity, category_id, size) {
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

      await pool.query(
        `UPDATE item SET
        name = $2,
        brand = $3,
        price = $4,
        stock_quantity = $5,
        category_id = $6,
        size = $7
        WHERE id = $1`,
        [
          id,
          updatedName,
          updatedBrand,
          updatedPrice,
          updatedStock,
          updatedCategoryId,
          updatedSize,
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

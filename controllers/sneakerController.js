import db from "../db/queries.js";
import dotenv from "dotenv";

dotenv.config();

export const homepageGet = async (req, res) => {
  res.render("index", {
    title: "SoleIndex",
    tag: "A Sneaker Management Platform",
  });
};

export const categoriesListGet = async (req, res) => {
  const view =
    req.route.path === "/categories" ? "categories" : "categoryManagement";

  try {
    const categories = await db.getAllCategories();
    console.log("categories:", categories);

    if (categories.length > 0) {
      res.render(view, {
        title: "Categories",
        categories: categories,
      });
    } else {
      res.status(404).send("No categories found.");
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const categoriesListPost = async (req, res) => {
  try {
    const { name, description } = req.body;
    await db.addCategory(name, description);
    console.log("added new category:", name, description);
    res.redirect("/category-management");
  } catch (error) {
    console.error("Error inserting category:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const categoriesListEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await db.editCategory(id, name, description);
    console.log("edited category:", id, name, description);
    res.redirect("/category-management");
  } catch (error) {
    console.error("Error editing category:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const categoriesListDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteCategory(id);
    res.redirect("/category-management");
    console.log("deleted category:", id);
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const itemsListGet = async (req, res) => {
  const { id } = req.params;

  let view;
  if (req.route.path == "/items" || req.route.path == "/categories/:id") {
    view = "items";
  } else {
    view = "itemManagement";
  }
  const query = req.query.search || "";
  const searchType = req.query.searchType || "brand";
  let items;
  let title = "Items";

  try {
    const categories = await db.getAllCategories();

    if (id) {
      items = await db.getItemsBySearch(id, "category");

      const category = await db.getCategoryById(id);
      if (category && category.name) {
        title = `${category.name} Items`;
      }
    } else if (query) {
      items = await db.getItemsBySearch(query, searchType);
    } else {
      items = await db.getAllItems();
    }
    console.log("items:", items);

    if (items.length > 0) {
      res.render(view, {
        title: title,
        categories: categories,
        items: items,
      });
    } else {
      res.status(404).send("No items found.");
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const itemsListPost = async (req, res) => {
  try {
    const { name, brand, price, stock_quantity, category_id, size } = req.body;
    await db.addItem(name, brand, price, stock_quantity, category_id, size);
    console.log("added new item:", name, brand);
    res.redirect("/item-management");
  } catch (error) {
    console.error("Error inserting item:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const itemsListEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, price, stock_quantity, category_id, size } = req.body;
    await db.editItem(
      id,
      name,
      brand,
      price,
      stock_quantity,
      category_id,
      size
    );
    console.log("edited item:", id, name);
    res.redirect("/item-management");
  } catch (error) {
    console.error("Error editing item:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const itemsListDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteItem(id);
    res.redirect("/item-management");
    console.log("deleted item:", id);
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const adminGet = async (req, res) => {
  const isAdmin = req.session.isAdmin;

  if (isAdmin) {
    res.redirect("/category-management");
  } else {
    res.render("adminLogin");
  }
};

export const adminPost = async (req, res) => {
  const enteredPassword = req.body.password;

  if (enteredPassword === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.redirect("/category-management");
  } else {
    res.status(401).send("Incorrect Password");
  }
};

export const adminSessionDestroy = async (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
};

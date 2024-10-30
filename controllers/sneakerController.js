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
    res.redirect("/admin");
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
    res.redirect("/admin");
  } catch (error) {
    console.error("Error editing category:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const categoriesListDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteCategory(id);
    res.redirect("/admin");
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const itemsListGet = async (req, res) => {
  const view = req.route.path === "/items" ? "items" : "itemManagement";

  try {
    const items = await db.getAllItems();
    const categories = await db.getAllCategories();

    if (items.length > 0) {
      res.render(view, {
        title: "Items",
        items: items,
        categories: categories,
      });
    } else {
      res.status(404).send("No items found.");
    }
  } catch (error) {
    console.error("Error fetching items or categories:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const itemsListSearch = async (req, res) => {
  const query = req.query.search || "";

  try {
    let items, categories;

    if (query) {
      items = await db.getItemsBySearch(query);
    } else {
      items = await db.getAllItems();
    }

    categories = await db.getAllCategories();

    res.json({ items, categories });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const itemsListPost = async (req, res) => {
  try {
    const { name, brand, price, stock_quantity, category_id, size } = req.body;
    await db.addItem(name, brand, price, stock_quantity, category_id, size);
    res.redirect("/admin");
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
    res.redirect("/admin");
  } catch (error) {
    console.error("Error editing item:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const itemsListDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteItem(id);
    res.redirect("/admin");
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const adminGet = async (req, res) => {
  const isAdmin = req.session.isAdmin;

  try {
    const categories = await db.getAllCategories();
    // const items = await db.getAllItems();

    if (isAdmin) {
      res.render("admin", {
        title: "Admin Dashboard",
        isAdmin: true,
        categories: categories,
      });
    } else {
      res.render("admin", {
        title: "Admin Login",
        isAdmin: false,
        categories: categories,
      });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const adminPost = async (req, res) => {
  const enteredPassword = req.body.password;

  if (enteredPassword === process.env.ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    res.redirect("/admin");
  } else {
    res.status(401).render("admin", {
      title: "Admin Login",
      message: "Invalid credentials",
      isAdmin: false,
    });
  }
};

export const adminSessionDestroy = async (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
};

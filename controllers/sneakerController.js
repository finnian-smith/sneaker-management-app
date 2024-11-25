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

export const categoriesListGetJson = async (req, res) => {
  try {
    const categories = await db.getAllCategories();

    if (categories.length > 0) {
      res.json({
        success: true,
        message: "Categories returned successfully",
        categories: categories,
      });
    } else {
      res.status(404).send("No categories found.");
    }
  } catch (error) {
    console.error("Error fetching items or categories:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const categoriesListPost = async (req, res) => {
  try {
    const { name, description, image_url, tag_color } = req.body;
    await db.addCategory(name, description, image_url, tag_color);

    const categories = await db.getAllCategories();

    res.json({
      success: true,
      message: "Category added successfully",
      categories: categories,
    });
  } catch (error) {
    console.error("Error inserting category:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const categoriesListEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, tag_color } = req.body;
    await db.editCategory(id, name, description, image_url, tag_color);

    const categories = await db.getAllCategories();

    res.json({
      success: true,
      message: "Category edited successfully",
      categories: categories,
    });
  } catch (error) {
    console.error("Error editing category:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const categoriesListDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmationName } = req.body;

    const category = await db.getCategoryById(id);

    if (category.name !== confirmationName) {
      return res.status(400).json({
        success: false,
        message: "Entered name does not match the category name.",
      });
    }

    await db.deleteCategory(id);

    const categories = await db.getAllCategories();

    res.json({
      success: true,
      message: "Category deleted successfully",
      categories: categories,
    });
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

export const itemsListGetJson = async (req, res) => {
  try {
    const items = await db.getAllItems();
    const categories = await db.getAllCategories();

    if (items.length > 0) {
      res.json({
        success: true,
        message: "Items returned successfully",
        categories: categories,
        items: items,
      });
    } else {
      res.status(404).send("No items found.");
    }
  } catch (error) {
    console.error("Error fetching items or categories:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const itemsListGetById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await db.getItemById(id);

    if (item) {
      res.render("itemProduct", {
        title: item.name,
        item: item,
      });
    } else {
      res.status(404).send("No item found.");
    }
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const itemsListCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await db.getCategoryById(id);

    if (!category) {
      return res.status(400).send("Category not found.");
    }

    const items = await db.getItemsByCategoryId(id);

    if (items.length > 0) {
      res.render("items", {
        title: `${category.name} Items`,
        items: items,
        category: category,
      });
    } else {
      res.status(404).send("No items found for this category.");
    }
  } catch (error) {
    console.error("Error fetching items by category:", error);
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
    const { name, brand, price, stock_quantity, category_id, size, image_url } =
      req.body;
    await db.addItem(
      name,
      brand,
      price,
      stock_quantity,
      category_id,
      size,
      image_url
    );

    const categories = await db.getAllCategories();
    const items = await db.getAllItems();

    res.json({
      success: true,
      message: "Item added successfully",
      categories: categories,
      items: items,
    });
  } catch (error) {
    console.error("Error inserting item:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const itemsListEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, price, stock_quantity, category_id, size, image_url } =
      req.body;

    await db.editItem(
      id,
      name,
      brand,
      price,
      stock_quantity,
      category_id,
      size,
      image_url
    );

    const categories = await db.getAllCategories();
    const items = await db.getAllItems();

    res.json({
      success: true,
      message: "Item edited successfully",
      categories: categories,
      items: items,
    });
  } catch (error) {
    console.error("Error editing item:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const itemsListDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmationName } = req.body;

    const item = await db.getItemById(id);

    if (item.name !== confirmationName) {
      return res.status(400).json({
        success: false,
        message: "Entered name does not match the item name.",
      });
    }

    await db.deleteItem(id);

    const categories = await db.getAllCategories();
    const items = await db.getAllItems();

    res.json({
      success: true,
      message: "Item deleted successfully",
      categories: categories,
      items: items,
    });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
        // categories: categories,
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

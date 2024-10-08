import db from "../db/queries.js";

export const homepageGet = async (req, res) => {
  res.render("index", { title: "Sneaker Management" });
};

export const categoriesListGet = async (req, res) => {
  try {
    const categories = await db.getAllCategories();
    console.log("categories:", categories);

    if (categories.length > 0) {
      res.render("categoryManagement", {
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
    res.redirect("/category");
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
    res.redirect("/category");
  } catch (error) {
    console.error("Error editing category:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const categoriesListDelete = async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteCategory(id);
    res.redirect("/category");
    console.log("deleted category:", id);
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const itemsListGet = async (req, res) => {
  const query = req.query.search || "";
  const searchType = req.query.searchType || "brand";
  let items;

  try {
    const categories = await db.getAllCategories();

    if (query) {
      items = await db.getItemsBySearch(query, searchType);
    } else {
      items = await db.getAllItems();
    }
    console.log("items:", items);

    if (items.length > 0) {
      res.render("itemManagement", {
        title: "Items",
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
    res.redirect("/item");
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
    res.redirect("/item");
  } catch (error) {
    console.error("Error editing item:", error);
    res.status(500).send("Internal Server Error");
  }
};

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

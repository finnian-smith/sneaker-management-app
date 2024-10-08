import db from "../db/queries.js";

export const categoriesListGet = async (req, res) => {
  try {
    const categories = await db.getAllCategories();
    console.log("categories:", categories);

    if (categories.length > 0) {
      res.render("index", {
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

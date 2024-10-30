import { Router } from "express";
import {
  homepageGet,
  categoriesListGet,
  categoriesListPost,
  categoriesListEdit,
  categoriesListDelete,
  itemsListGet,
  itemsListSearch,
  itemsListPost,
  itemsListEdit,
  itemsListDelete,
  adminGet,
  adminPost,
  adminSessionDestroy,
} from "../controllers/sneakerController.js";

import { isAuthenticated } from "../middleware/authenticationMiddleware.js";

const sneakerRouter = Router();

// home
sneakerRouter.get("/", homepageGet);

// categories
sneakerRouter.get("/categories", categoriesListGet);
sneakerRouter.get("/categories/:id", itemsListGet);

// items
sneakerRouter.get("/items", itemsListGet);

// admin
sneakerRouter.get("/admin", adminGet);
sneakerRouter.post("/admin/login", adminPost);
sneakerRouter.get("/admin/logout", adminSessionDestroy);

// admin - category
sneakerRouter.get(
  "/admin/category-management",
  isAuthenticated,
  categoriesListGet
);
sneakerRouter.post(
  "/admin/category-management/add",
  isAuthenticated,
  categoriesListPost
);
sneakerRouter.post(
  "/admin/category-management/edit/:id",
  isAuthenticated,
  categoriesListEdit
);
sneakerRouter.post(
  "/admin/category-management/delete/:id",
  isAuthenticated,
  categoriesListDelete
);

// admin - item
sneakerRouter.get(
  "/admin/item-management/search",
  isAuthenticated,
  itemsListSearch
);
sneakerRouter.get("/admin/item-management", isAuthenticated, itemsListGet);

sneakerRouter.post(
  "/admin/item-management/add",
  isAuthenticated,
  itemsListPost
);
sneakerRouter.post(
  "/admin/item-management/edit/:id",
  isAuthenticated,
  itemsListEdit
);
sneakerRouter.post(
  "/admin/item-management/delete/:id",
  isAuthenticated,
  itemsListDelete
);

export default sneakerRouter;

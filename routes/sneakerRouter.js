import { Router } from "express";
import {
  homepageGet,
  categoriesListGet,
  categoriesListPost,
  categoriesListEdit,
  categoriesListDelete,
  itemsListGet,
  itemsListPost,
  itemsListEdit,
  itemsListDelete,
  adminGet,
  adminPost,
  adminSessionDestroy,
} from "../controllers/sneakerController.js";

import { isAuthenticated } from "../middleware/authenticationMiddleware.js";

const sneakerRouter = Router();

sneakerRouter.get("/", homepageGet);

sneakerRouter.get("/categories", categoriesListGet);
sneakerRouter.get("/categories/:id", itemsListGet);
sneakerRouter.get("/items", itemsListGet);

sneakerRouter.get("/admin", adminGet);
sneakerRouter.post("/admin/login", adminPost);
sneakerRouter.get("/admin/logout", adminSessionDestroy);

sneakerRouter.get("/category-management", isAuthenticated, categoriesListGet);
sneakerRouter.post(
  "/category-management/add",
  isAuthenticated,
  categoriesListPost
);
sneakerRouter.post(
  "/category-management/edit/:id",
  isAuthenticated,
  categoriesListEdit
);
sneakerRouter.post(
  "/category-management/delete/:id",
  isAuthenticated,
  categoriesListDelete
);

sneakerRouter.get("/item-management", isAuthenticated, itemsListGet);
sneakerRouter.post("/item-management/add", isAuthenticated, itemsListPost);
sneakerRouter.post("/item-management/edit/:id", isAuthenticated, itemsListEdit);
sneakerRouter.post(
  "/item-management/delete/:id",
  isAuthenticated,
  itemsListDelete
);

export default sneakerRouter;

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
} from "../controllers/sneakerController.js";

const sneakerRouter = Router();

sneakerRouter.get("/", homepageGet);

sneakerRouter.get("/categories", categoriesListGet);
sneakerRouter.get("/items", itemsListGet);

sneakerRouter.get("/category-management", categoriesListGet);
sneakerRouter.post("/category-management/add", categoriesListPost);
sneakerRouter.post("/category-management/edit/:id", categoriesListEdit);
sneakerRouter.post("/category-management/delete/:id", categoriesListDelete);

sneakerRouter.get("/item-management", itemsListGet);
sneakerRouter.post("/item-management/add", itemsListPost);
sneakerRouter.post("/item-management/edit/:id", itemsListEdit);
sneakerRouter.post("/item-management/delete/:id", itemsListDelete);

export default sneakerRouter;

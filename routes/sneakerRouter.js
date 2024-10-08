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

sneakerRouter.get("/category", categoriesListGet);
sneakerRouter.post("/category/add", categoriesListPost);
sneakerRouter.post("/category/edit/:id", categoriesListEdit);
sneakerRouter.post("/category/delete/:id", categoriesListDelete);

sneakerRouter.get("/item", itemsListGet);
sneakerRouter.post("/item/add", itemsListPost);
sneakerRouter.post("/item/edit/:id", itemsListEdit);
sneakerRouter.post("/item/delete/:id", itemsListDelete);

export default sneakerRouter;

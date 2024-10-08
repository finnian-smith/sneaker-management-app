import { Router } from "express";
import {
  homepageGet,
  categoriesListGet,
  categoriesListPost,
  categoriesListEdit,
  categoriesListDelete,
  itemsListGet,
} from "../controllers/sneakerController.js";

const sneakerRouter = Router();

sneakerRouter.get("/", homepageGet);

sneakerRouter.get("/category", categoriesListGet);
sneakerRouter.post("/category/add", categoriesListPost);
sneakerRouter.post("/category/edit/:id", categoriesListEdit);
sneakerRouter.post("/category/delete/:id", categoriesListDelete);

sneakerRouter.get("/item", itemsListGet);

export default sneakerRouter;

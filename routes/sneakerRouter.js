import { Router } from "express";
import {
  homepageGet,
  categoriesListGet,
  categoriesListPost,
  categoriesListEdit,
} from "../controllers/sneakerController.js";

const sneakerRouter = Router();

sneakerRouter.get("/", homepageGet);

sneakerRouter.get("/category", categoriesListGet);
sneakerRouter.post("/category/add", categoriesListPost);
sneakerRouter.post("/category/edit/:id", categoriesListEdit);

export default sneakerRouter;

import { Router } from "express";
import {
  homepageGet,
  categoriesListGet,
  categoriesListPost,
} from "../controllers/sneakerController.js";

const sneakerRouter = Router();

sneakerRouter.get("/", homepageGet);

sneakerRouter.get("/category", categoriesListGet);
sneakerRouter.post("/category/add", categoriesListPost);

export default sneakerRouter;

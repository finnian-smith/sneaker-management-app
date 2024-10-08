import { Router } from "express";
import { categoriesListGet } from "../controllers/sneakerController.js";

const sneakerRouter = Router();

sneakerRouter.get("/", categoriesListGet);

export default sneakerRouter;

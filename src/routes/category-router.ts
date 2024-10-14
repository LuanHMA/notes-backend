import { Router } from "express";
import { createCategoryController } from "../controller/category/create-category";

export const categoryRouter = Router();

categoryRouter.post('/create', createCategoryController)
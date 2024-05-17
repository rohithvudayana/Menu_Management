import express from "express";
import { createCategory, editCategory, getAllCategories, getCategoryByIdOrName } from "../controllers/categoryController";

export const categoryRouter = express.Router();
categoryRouter.route("/category")
                .post(createCategory)
                .get(getAllCategories)
categoryRouter.route("/category/:idorname")
                .get(getCategoryByIdOrName)
categoryRouter.route("/category/edit/:id")
                .put(editCategory)
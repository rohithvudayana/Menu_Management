import express from "express";
import { createCategory, deleteAllCategories, editCategory, getAllCategories, getCategoryByIdOrName } from "../controllers/categoryController";

export const categoryRouter = express.Router();
categoryRouter.route("/category")
                .post(createCategory)
                .get(getAllCategories)
                .delete(deleteAllCategories)
categoryRouter.route("/category/:idOrName")
                .get(getCategoryByIdOrName)
categoryRouter.route("/category/edit/:id")
                .put(editCategory)
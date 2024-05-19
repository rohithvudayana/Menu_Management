import express from "express";
import { createCategory, deleteAllCategories, editCategory, getAllCategories, getCategoryByIdOrName } from "../controllers/categoryController";

export const categoryRouter = express.Router();

categoryRouter.route("/category")
    .post(createCategory) // POST request to create a new category
    .get(getAllCategories) // GET request to retrieve all categories
    .delete(deleteAllCategories); // DELETE request to delete all categories

categoryRouter.route("/category/:idOrName")
    .get(getCategoryByIdOrName); // GET request to retrieve a category by ID or name

categoryRouter.route("/category/edit/:id")
    .put(editCategory); // PUT request to edit a category by ID

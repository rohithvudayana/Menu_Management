import express from "express";

import {
    createSubCategory,
    getAllSubCategories,
    getSubCategoriesByCategory,
    getSubCategoryByIdOrName,
    editSubCategory,
    deleteAllSubCategories
} from "../controllers/subcategoryController";

export const subRouter = express.Router();

subRouter.route("/subCategory")
    .post(createSubCategory)   // POST request to create a new subcategory
    .get(getAllSubCategories)  // GET request to retrieve all subcategories
    .delete(deleteAllSubCategories); // DELETE request to delete all subcategories

subRouter.route("/subCategory/:idOrName")
    .get(getSubCategoryByIdOrName); // GET request to retrieve a subcategory by ID or name

subRouter.route("/subCategory/byCat/:categoryId")
    .get(getSubCategoriesByCategory); // GET request to retrieve subcategories by category ID

subRouter.route("/subCategory/edit/:subCategoryId")
    .put(editSubCategory); // PUT request to edit a subcategory by its ID


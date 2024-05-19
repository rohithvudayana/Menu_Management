import express from "express"
import { createSubCategory, getAllSubCategories, getSubCategoriesByCategory, getSubCategoryByIdOrName, editSubCategory, deleteAllSubCategories} from "../controllers/subcategoryController"

export const subRouter = express.Router();
subRouter.route("/subCategory")
            .post(createSubCategory)
            .get(getAllSubCategories)
            .delete(deleteAllSubCategories)
subRouter.route("/subCategory/:idOrName")
            .get(getSubCategoryByIdOrName)
subRouter.route("/subCategory/byCat/:categoryId")
            .get(getSubCategoriesByCategory)
subRouter.route("/subCategory/edit/:subCategoryId")
            .put(editSubCategory);
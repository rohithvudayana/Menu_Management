import express from "express"
import { createSubCategory, getAllSubCategories, getSubCategoriesByCategory, getSubCategoryByIdOrName, editSubCategory} from "../controllers/subcategoryController"

export const subRouter = express.Router();
subRouter.route("/subCategory")
            .post(createSubCategory)
            .get(getAllSubCategories)
subRouter.route("/subCategory/:idorname")
            .get(getSubCategoryByIdOrName)
subRouter.route("/subCategory/byCat/:categoryId")
            .get(getSubCategoriesByCategory)
subRouter.route("/subCategory/edit/:subCategoryId")
            .put(editSubCategory);
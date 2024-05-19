import { Request, Response, NextFunction } from "express";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers/createResponse";
import { StatusCodes } from "http-status-codes";
import { Subcategory, SubcategoryModel } from "../models/subcategory";
import { Category, CategoryModel } from "../models/category";
import mongoose from "mongoose";

// Create a new sub-category
export const createSubCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newSubCategoryData: SubcategoryModel = req.body;

            // Validate request body
            if (!newSubCategoryData || !newSubCategoryData.name || !newSubCategoryData.image ||
                !newSubCategoryData.description || newSubCategoryData.groupType !== "subCategory") {
                return next(CustomErrors.BadRequestError("Body should contain all sub-category details and correct groupType"));
            }

            // Check if sub-category with the same name already exists
            const findSubCat = await Subcategory.findOne({ name: newSubCategoryData.name });
            if (findSubCat) {
                return next(CustomErrors.BadRequestError("Subcategory already exists in the database."));
            }

            // Create new sub-category
            const newSubCategory = await Subcategory.create(newSubCategoryData);
            if (!newSubCategory) {
                return next(CustomErrors.BadRequestError("Failed to create subCategory"));
            }

            res.status(StatusCodes.CREATED).json(httpResponse(true, "Sub-category created successfully", newSubCategory));  
        } catch (error) {
            next(error);
        }
    }
);

// Get all sub-categories
export const getAllSubCategories = asyncWrapper(
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            // Fetch all sub-categories from the database
            const allSubCategories = await Subcategory.find({});
            if (!allSubCategories) {
                return next(CustomErrors.NotFoundError("No sub-categories found."));
            }
            res.status(StatusCodes.OK).json(httpResponse(true, "All sub-categories retrieved successfully", allSubCategories));
        } catch (error) {
            next(error);
        }
    }
);

// Get sub-categories by category ID
export const getSubCategoriesByCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.params.categoryId;
            // Check if category with this ID present or not
            const categoryData: CategoryModel | null = await Category.findById(categoryId);
            if (!categoryData) {
                return next(CustomErrors.NotFoundError("Category not found."));
            }
            // Getting subcategoryIds from CategoryData
            const subcategoryIds = categoryData.subcategories;
            if (!subcategoryIds) {
                return next(CustomErrors.NotFoundError("No sub-categories found under this category."));
            }
            // finding Subcategories with their correspondng IDS
            const subCategories = await Subcategory.find({ _id: { $in: subcategoryIds } });
            if (!subCategories) {
                return next(CustomErrors.NotFoundError("No sub-categories found with these IDs."));
            }
            res.status(StatusCodes.OK).json(httpResponse(true, "Sub-categories retrieved successfully", subCategories));
        } catch (error) {
            next(error);
        }
    }
);

// Get sub-category by ID or name
export const getSubCategoryByIdOrName = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subcategoryIdOrName = req.params.idOrName;
            let subCategory;

            // Check if the provided ID is valid
            if (mongoose.Types.ObjectId.isValid(subcategoryIdOrName)) {
                // Treat it as an ID
                subCategory = await Subcategory.findById(subcategoryIdOrName);
            } else {
                // Treat it as a name
                subCategory = await Subcategory.findOne({ name: subcategoryIdOrName });
            }

            if (!subCategory) {
                return next(CustomErrors.NotFoundError("Sub-category not found"));
            }

            res.status(StatusCodes.OK).json(httpResponse(true, "Sub-category retrieved successfully", subCategory));
        } catch (error) {
            next(error);
        }
    }
);

// Edit a sub-category
export const editSubCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subCategoryId: string = req.params.subCategoryId;
            const updatedData: Partial<SubcategoryModel> = req.body;

            // Validate request body
            if (!updatedData || !updatedData.name || !updatedData.image ||
                !updatedData.description || updatedData.groupType !== "subCategory") {
                return next(CustomErrors.BadRequestError("Body should contain all sub-category details and correct groupType"));
            }

            // Update the sub-category
            const updatedSubCategory = await Subcategory.findByIdAndUpdate(subCategoryId, updatedData, { new: true });
            if (!updatedSubCategory) {
                return next(CustomErrors.NotFoundError("Sub-category not found."));
            }

            res.status(StatusCodes.OK).json(httpResponse(true, "Sub-category updated successfully", updatedSubCategory));
        } catch (error) {
            next(error);
        }
    }
);

// Delete all sub-categories
export const deleteAllSubCategories = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Delete all sub-categories from the database
            const deletedsubCategories = await Subcategory.deleteMany({});
            if (!deletedsubCategories) {
                return next(CustomErrors.NotFoundError("No subCategories found to delete."));
            }
            res.status(StatusCodes.OK).json(httpResponse(true, "All subCategories deleted successfully", {}));
        } catch (error) {
            next(error);
        }
    }
);

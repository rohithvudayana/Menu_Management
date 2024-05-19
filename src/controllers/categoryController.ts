import { Request, Response, NextFunction } from "express";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers/createResponse";
import { StatusCodes } from "http-status-codes";
import { Category, CategoryModel } from "../models/category";
import mongoose from "mongoose";


// Controller function to create a new category.

export const createCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newCategoryData: CategoryModel = req.body;

            // Validate request body
            if (!newCategoryData || !newCategoryData.name || !newCategoryData.image ||
                !newCategoryData.description || newCategoryData.groupType !== "category") {
                return next(CustomErrors.BadRequestError("Body should contain all category details and correct groupType."));
            }

            // Check if category with the same name already exists
            const findCat = await Category.findOne({ name: newCategoryData.name });
            if (findCat) {
                return next(CustomErrors.BadRequestError("Category already exists in the database."));
            }

            // Create new category
            const newCategory = await Category.create(newCategoryData);
            if (!newCategory) {
                return next(CustomErrors.BadRequestError("Failed to create category"));
            }

            res.status(StatusCodes.CREATED).json(httpResponse(true, "Category created successfully", newCategory));
        } catch (error) {
            next(error);
        }
    }
);


//  Controller function to get all categories.

export const getAllCategories = asyncWrapper(
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            // Fetch all categories from the database
            const allCategories = await Category.find({});
            if (!allCategories) {
                return next(CustomErrors.NotFoundError("No categories found."));
            }
            res.status(StatusCodes.OK).json(httpResponse(true, "All categories retrieved successfully", allCategories));
        } catch (error) {
            next(error);
        }
    }
);



//  Controller function to get a category by ID or name.

export const getCategoryByIdOrName = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryIdOrName = req.params.idOrName;
            let category;

            // Check if the provided ID is valid
            if (mongoose.Types.ObjectId.isValid(categoryIdOrName)) {
                // Treat it as an ID
                category = await Category.findById(categoryIdOrName);
            } else {
                // Treat it as a name
                category = await Category.findOne({ name: categoryIdOrName });
            }

            if (!category) {
                return next(CustomErrors.NotFoundError("Category not found"));
            }

            res.status(StatusCodes.OK).json(httpResponse(true, "Category retrieved successfully", category));
        } catch (error) {
            next(error);
        }
    }
);



//   Controller function to edit a category.

export const editCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId: string = req.params.id;
            const updatedCategoryData: Partial<CategoryModel> = req.body;

            // Validate request body
            if (!updatedCategoryData || !updatedCategoryData.name || !updatedCategoryData.image ||
                !updatedCategoryData.description || updatedCategoryData.groupType !== "category") {
                return next(CustomErrors.BadRequestError("Body should contain all category details and correct groupType."));
            }

            // Update the category
            const updatedCategory = await Category.findByIdAndUpdate(categoryId, updatedCategoryData, { new: true });
            if (!updatedCategory) {
                return next(CustomErrors.NotFoundError("Category not found."));
            }

            res.status(StatusCodes.OK).json(httpResponse(true, "Category updated successfully", updatedCategory));
        } catch (error) {
            next(error);
        }
    }
);


//   Controller function to delete all categories.

export const deleteAllCategories = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Delete all categories from the database
            await Category.deleteMany({});
            res.status(StatusCodes.OK).json(httpResponse(true, "All categories deleted successfully", {}));
        } catch (error) {
            next(error);
        }
    }
);

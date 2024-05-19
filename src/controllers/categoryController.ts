import { Request, Response, NextFunction } from "express";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers/createResponse";
import { StatusCodes } from "http-status-codes";
import { Category, CategoryModel } from "../models/category";
import mongoose from "mongoose";

export const createCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newCategoryData: CategoryModel = req.body;
            if (!newCategoryData || !newCategoryData.name || !newCategoryData.image || !newCategoryData.description || newCategoryData.groupType !== "category") {
                return next(CustomErrors.BadRequestError("Body should contain all category details and correct groupType."));
            }
            const findCat = await Category.findOne({ name: newCategoryData.name });
            if (findCat) {
                return next(CustomErrors.BadRequestError("Category already exists in the database."));
            }
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

export const getAllCategories = asyncWrapper(
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
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

export const getCategoryByIdOrName = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryIdOrName = req.params.idorname;
            let category;
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

export const editCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId: string = req.params.id;
            const updatedCategoryData: Partial<CategoryModel> = req.body;
            if (!updatedCategoryData || !updatedCategoryData.name || !updatedCategoryData.image ||
                !updatedCategoryData.description || updatedCategoryData.groupType !== "category") {
                return next(CustomErrors.BadRequestError("Body should contain all category details and correct groupType."));
            }
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

export const deleteAllCategories = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await Category.deleteMany({});
            res.status(StatusCodes.OK).json(httpResponse(true, "All categories deleted successfully", {}));
        } catch (error) {
            next(error);
        }
    }
);


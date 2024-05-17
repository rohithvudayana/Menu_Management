import { Request, Response, NextFunction } from "express";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers/createResponse";
import { StatusCodes } from "http-status-codes";
import { Subcategory, SubcategoryModel } from "../models/subcategory";
import { Category, CategoryModel } from "../models/category";
import mongoose from "mongoose";

export const createSubCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newSubCategoryData: SubcategoryModel = req.body;
            if (!newSubCategoryData || !newSubCategoryData.name || !newSubCategoryData.image || !newSubCategoryData.description || newSubCategoryData.groupType !== "subCategory") {
                return next(CustomErrors.BadRequestError("Body should contain all sub-category details and correct groupType"));
            }
            const findSubCat = await Subcategory.findOne({ name: newSubCategoryData.name });
            if (findSubCat) {
                return next(CustomErrors.BadRequestError("Subcategory already exists in the database."));
            }
            const newSubCategory = await Subcategory.create(newSubCategoryData);
            if(!newSubCategory){
                return next(CustomErrors.BadRequestError("Failed to create subCategory"));
            }
            res.status(StatusCodes.CREATED).json(httpResponse(true, "Sub-category created successfully", newSubCategory));
        } catch (error) {
            next(error);
        }
    }
);

export const getAllSubCategories = asyncWrapper(
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const allSubCategories = await Subcategory.find({});
            if (!allSubCategories || allSubCategories.length === 0) {
                return next(CustomErrors.NotFoundError("No sub-categories found."));
            }
            res.status(StatusCodes.OK).json(httpResponse(true, "All sub-categories retrieved successfully", allSubCategories));
        } catch (error) {
            next(error);
        }
    }
);

export const getSubCategoriesByCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId = req.params.categoryId;
            const categoryData: CategoryModel | null = await Category.findById(categoryId);
            if (!categoryData) {
                return next(CustomErrors.NotFoundError("Category not found."));
            }
            const subcategoryIds = categoryData.subcategories;
            if (!subcategoryIds || subcategoryIds.length === 0) {
                return next(CustomErrors.NotFoundError("No sub-categories found under this category."));
            }
            const subCategories = await Subcategory.find({ _id: { $in: subcategoryIds } });
            if (!subCategories || subCategories.length === 0) {
                return next(CustomErrors.NotFoundError("No sub-categories found with these IDs."));
            }
            res.status(StatusCodes.OK).json(httpResponse(true, "Sub-categories retrieved successfully", subCategories));
        } catch (error) {
            next(error);
        }
    }
);

export const getSubCategoryByIdOrName = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subcategoryIdOrName = req.params.idorname;
            let subCategory;
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

export const editSubCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subCategoryId: string = req.params.subCategoryId;
            const updatedData: Partial<SubcategoryModel> = req.body;
            if (!updatedData || !updatedData.name || !updatedData.image ||
                !updatedData.description || updatedData.groupType !== "subCategory") {
                return next(CustomErrors.BadRequestError("Body should contain all sub-category details and correct groupType"));
            }
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


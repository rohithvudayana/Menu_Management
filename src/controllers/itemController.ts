import { Request, Response, NextFunction } from "express";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers/createResponse";
import { StatusCodes } from "http-status-codes";
import { Item, ItemModel } from "../models/item";
import { Subcategory, SubcategoryModel } from "../models/subcategory";
import mongoose from 'mongoose';

export const createItem = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newItemData: ItemModel = req.body;
            if (!newItemData || !newItemData.name || !newItemData.image || !newItemData.description || !newItemData.price || newItemData.groupType !== "item") {
                return next(CustomErrors.BadRequestError("Body should contain all item details and correct groupType"));
            }
            const findItem = await Item.findOne({ name: newItemData.name });
            if (findItem) {
                return next(CustomErrors.BadRequestError("Item already exists in the database."));
            }
            const newItem = await Item.create(newItemData);
            if (!newItem) {
                return next(CustomErrors.BadRequestError("Failed to create item due to database error."));
            }
            res.status(StatusCodes.CREATED).json(httpResponse(true, "Item created successfully", newItem));
        } catch (error) {
            next(error);
        }
    }
);

export const getAllItems = asyncWrapper(
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const allItems = await Item.find({});
            if(!allItems){
                return next(CustomErrors.NotFoundError("No Items preasent in the database."))
            }
            res.status(StatusCodes.OK).json(httpResponse(true, "All items retrieved successfully", allItems));
        } catch (error) {
            next(error);
        }
    }
);

export const getItemsByCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const CategoryId: string = req.params.categoryId;
            const categoryData: SubcategoryModel | null = await Subcategory.findById(CategoryId);
            if (!categoryData) {
                return next(CustomErrors.NotFoundError("Category not found"));
            }
            const itemIds = categoryData.items;
            if(!itemIds){
                return next(CustomErrors.NotFoundError("This category does not contain any items in it"))
            }
            const items = await Item.find({ _id: { $in: itemIds } });
            if(!items){
                return next(CustomErrors.NotFoundError("No items present for this category"));
            }
            res.status(StatusCodes.OK).json(httpResponse(true, "Items retrieved successfully", items));
        } catch (error) {
            next(error);
        }
    }
);


export const getItemsBySubcategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subcategoryId : string = req.params.subcategoryId;
            const subcategoryData: SubcategoryModel | null = await Subcategory.findById(subcategoryId);
            if (!subcategoryData) {
                return next(CustomErrors.NotFoundError("Subcategory not found"));
            }
            const itemIds = subcategoryData.items;
            if(!itemIds){
                return next(CustomErrors.NotFoundError("This subCategory does not contain any items in it"))
            }
            const items = await Item.find({ _id: { $in: itemIds } });
            if(!items){
                return next(CustomErrors.NotFoundError("No items present for this category"));
            }
            res.status(StatusCodes.OK).json(httpResponse(true, "Items retrieved successfully", items));
        } catch (error) {
            next(error);
        }
    }
);


export const getItemByIdOrName = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const itemIdOrName = req.params.idorname;
            let item;
            if (mongoose.Types.ObjectId.isValid(itemIdOrName)) {
                // Treat it as an ID
                item = await Item.findById(itemIdOrName);
            } else {
                // Treat it as a name
                item = await Item.findOne({ name: itemIdOrName });
            }
            if (!item) {
                return next(CustomErrors.NotFoundError("Item not found"));
            }
            res.status(StatusCodes.OK).json(httpResponse(true, "Item retrieved successfully", item));
        } catch (error) {
            next(error);
        }
    }
);

export const editItem = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const itemId: string = req.params.itemId;
            const updatedData: Partial<ItemModel> = req.body;
            if (!updatedData || Object.keys(updatedData).length === 0 ||
                !updatedData.name || !updatedData.image ||
                !updatedData.description || !updatedData.price) {
                return next(CustomErrors.BadRequestError("Body should contain all item details."));
            }
            const updatedItem = await Item.findByIdAndUpdate(itemId, updatedData, { new: true });
            if (!updatedItem) {
                return next(CustomErrors.NotFoundError("Item not found."));
            }
            res.status(StatusCodes.OK).json(httpResponse(true, "Item updated successfully", updatedItem));
        } catch (error) {
            next(error);
        }
    }
);




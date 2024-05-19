import { Request, Response, NextFunction } from "express";
import * as CustomErrors from "../errors";
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers/createResponse";
import { StatusCodes } from "http-status-codes";
import { Item, ItemModel } from "../models/item";
import { Subcategory, SubcategoryModel } from "../models/subcategory";
import mongoose from 'mongoose';
import { Category, CategoryModel } from "../models/category";

// Controller function to create a new item
export const createItem = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newItemData: ItemModel = req.body;

            // Validate request body
            if (!newItemData || !newItemData.name || !newItemData.image || !newItemData.description || !newItemData.price || newItemData.groupType !== "item") {
                return next(CustomErrors.BadRequestError("Body should contain all item details and correct groupType"));
            }

            // Check if item with the same name already exists
            const findItem = await Item.findOne({ name: newItemData.name });
            if (findItem) {
                return next(CustomErrors.BadRequestError("Item already exists in the database."));
            }

            // Create new item
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

// Controller function to get all items
export const getAllItems = asyncWrapper(
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            // Fetch all items from the database
            const allItems = await Item.find();
            if (!allItems) {
                return next(CustomErrors.NotFoundError("No Items present in the database."))
            }
            res.status(StatusCodes.OK).json(httpResponse(true, "All items retrieved successfully", allItems));
        } catch (error) {
            next(error);
        }
    }
);

// Controller function to get items by category
export const getItemsByCategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const CategoryId: string = req.params.categoryId;

            // Find category data by ID
            const categoryData: CategoryModel | null = await Category.findById(CategoryId);
            if (!categoryData) {
                return next(CustomErrors.NotFoundError("Category not found"));
            }

            const itemIds = categoryData.items;
            if (!itemIds) {
                return next(CustomErrors.NotFoundError("This category does not contain any items"));
            }

            // Find items by item IDs
            const categoryItems = await Item.find({ _id: { $in: itemIds } });
            if (!categoryItems) {
                return next(CustomErrors.NotFoundError("No items found for this category"));
            }

            res.status(StatusCodes.OK).json(httpResponse(true, "Items retrieved successfully", categoryItems));
        } catch (error) {
            next(error);
        }
    }
);

// Controller function to get items by subcategory
export const getItemsBySubcategory = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subcategoryId: string = req.params.subCategoryId;
            // Find subcategory data by ID
            const subcategoryData: SubcategoryModel | null = await Subcategory.findById(subcategoryId);
            if (!subcategoryData) {
                return next(CustomErrors.NotFoundError("Subcategory not found"));
            }

            const itemIds = subcategoryData.items;
            if (!itemIds) {
                return next(CustomErrors.NotFoundError("This subcategory does not contain any items"));
            }

            // Find items by item IDs
            const items = await Item.find({ _id: { $in: itemIds } });
            if (!items) {
                return next(CustomErrors.NotFoundError("No items found for this subcategory"));
            }

            res.status(StatusCodes.OK).json(httpResponse(true, "Items retrieved successfully", items));
        } catch (error) {
            next(error);
        }
    }
);

// Controller function to get an item by ID or name
export const getItemByIdOrName = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const itemIdOrName = req.params.idOrName;
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

// Controller function to edit an item
export const editItem = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const itemId: string = req.params.itemId;
            const updatedData: Partial<ItemModel> = req.body;

            // Validate request body
            if (!updatedData || Object.keys(updatedData).length === 0 ||
                !updatedData.name || !updatedData.image ||
                !updatedData.description || !updatedData.price || updatedData.groupType !== "item" ) {
                return next(CustomErrors.BadRequestError("Body should contain all item details and correct gourpType"));
            }
            // Update the item
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

// Controller function to delete all items
export const deleteAllItems = asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Delete all items from the database
            await Item.deleteMany();
            res.status(StatusCodes.OK).json(httpResponse(true, "All Items deleted successfully", {}));
        } catch (error) {
            next(error);
        }
    }
);

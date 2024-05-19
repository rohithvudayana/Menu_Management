import express from "express";
import { getAllItems, createItem, getItemsByCategory, getItemsBySubcategory, getItemByIdOrName, editItem, deleteAllItems} from "../controllers/itemController";

export const itemRouter = express.Router();

itemRouter.route("/item")
            .post(createItem) // POST request to create a new item
            .get(getAllItems) // GET request to retrieve all items
            .delete(deleteAllItems); // DELETE request to delete all items

itemRouter.route("/item/:idOrName")
            .get(getItemByIdOrName); // GET request to retrieve an item by ID or name

itemRouter.route("/item/byCat/:categoryId")
            .get(getItemsByCategory); // GET request to retrieve items by category

itemRouter.route("/item/bySub/:subCategoryId")
            .get(getItemsBySubcategory); // GET request to retrieve items by subcategory

itemRouter.route("/item/edit/:itemId")
            .put(editItem); // PUT request to edit an item


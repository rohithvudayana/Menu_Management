import express from "express";
import { getAllItems, createItem, getItemsByCategory, getItemsBySubcategory, getItemByIdOrName, editItem, deleteAllItems} from "../controllers/itemController";

export const itemRouter = express.Router();
itemRouter.route("/item")
            .post(createItem)
            .get(getAllItems)
            .delete(deleteAllItems)
itemRouter.route("/item/:idOrName")
            .get(getItemByIdOrName)
itemRouter.route("/item/byCat/:categoryId")
            .get(getItemsByCategory)
itemRouter.route("/item/bySub/:subCategoryId")
            .get(getItemsBySubcategory)
itemRouter.route("/item/edit/:itemId")
            .put(editItem);

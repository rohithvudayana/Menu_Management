import express from "express";
import { getAllItems, createItem, getItemsByCategory, getItemsBySubcategory, getItemByIdOrName, editItem} from "../controllers/itemController";

export const itemRouter = express.Router();
itemRouter.route("/item")
            .post(createItem)
            .get(getAllItems)
itemRouter.route("/item/:idorname")
            .get(getItemByIdOrName)
itemRouter.route("/item/byCat/:categoryId")
            .get(getItemsByCategory)
itemRouter.route("/item/bySub/:subcategoryId")
            .get(getItemsBySubcategory)
itemRouter.route("/item/edit/:itemId")
            .put(editItem);

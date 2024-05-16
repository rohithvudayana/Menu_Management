import express from "express";
import { createCategory, getCategory } from "../controllers/categoryController";

export const categoryRouter = express.Router();
categoryRouter.route("/category").post(createCategory);
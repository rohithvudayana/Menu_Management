import { Request, Response, NextFunction } from "express";
import * as CustomErrors from "../errors"
import asyncWrapper from "../helpers/asyncWrapper";
import { httpResponse } from "../helpers/createResponse";
import { StatusCodes } from "http-status-codes";
import { Category } from "../models/category";

export const createCategory = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        try{
            const newCategory = _req.body;
            if(!newCategory.name || !newCategory.image || !newCategory.tax || !newCategory.taxApplicability){
                return _next(CustomErrors.BadRequestError("Enter all details !!"))
            }
            await Category.create(newCategory);
            _res.status(StatusCodes.CREATED).json(httpResponse(true, "Product created successfully", newCategory))
        }catch(error){
            _next(error);
        }
    }
)

export const getCategory = asyncWrapper(
    async(_req: Request, _res: Response, _next: NextFunction) => {
        try{
            const allCategories = await Category.find({});
            if(!allCategories || allCategories.length == 0){
                return _next(CustomErrors.NotFoundError("Categories not found"))
            }
            _res.status(StatusCodes.OK).json(httpResponse(true, "All categories retreived succesfully", allCategories))
        }catch(error){
            _next(error);
        }
    }
)

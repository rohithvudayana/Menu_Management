import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import * as CustomError from "../errors/";

// Define the type for the callback function
type Callback = (
  _req: Request,
  _res: Response,
  _next: NextFunction
) => Promise<void>;

// Generate a wrapper function that executes the callback function
// safely and handles any errors that may occur
const asyncWrapper = (callback: Callback): Callback =>
    async (_req: Request, _res: Response, _next: NextFunction): Promise<void> => {
        try {
            // Execute the callback function
            await callback(_req, _res, _next);
        } catch (error: any) {
            // Handle errors
            console.error(error.message);

            // Check if the error is a mongoose cast error
            if (error instanceof mongoose.Error.CastError) {
                _next(CustomError.BadRequestError("Invalid user id"));
            }

            // Handle other errors
            _next(CustomError.InternalServerError(`Something went wrong ${error.message}`));
        }
    };

export default asyncWrapper;


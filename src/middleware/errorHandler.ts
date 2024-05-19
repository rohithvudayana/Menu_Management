import { NextFunction, Request, Response } from "express";
import { httpResponse } from "../helpers/createResponse";
import { createCustomApiError } from "../errors/customApiError";

// Error handling middleware function
export const errorHandler = (
    err: createCustomApiError,  // Error object
    _req: Request,             // Express request object
    _res: Response,            // Express response object
    _next: NextFunction        // Express next function
) => {
    console.error(`Error ${err.statusCode}: ${err.message}`);  // Log the error message
    return _res.status(err.statusCode).json(httpResponse(false, err.message, {}));  // Send error response
};

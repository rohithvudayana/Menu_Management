import express, { Router } from "express";
import dotenv from "dotenv";
import { connectDB } from "./database/database";
import { routeNotFound } from "./middleware/routeNotFound";
import { errorHandler } from "./middleware/errorHandler";
import { httpResponse } from "./helpers/createResponse";
import { BASEURL } from "../constants";
import { categoryRouter } from "./routes/categoryRouter";
import { itemRouter } from "./routes/itemRouter";
import { subRouter } from "./routes/subCategoryRouter";

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

try {
    // Check if the database connection string is provided in the .env file
    if (!process.env.CONNECTION) {
        throw new Error("No connection string found in .env file");
    }

    // Connect to the database
    connectDB(process.env.CONNECTION);

    // Start the server
    app.listen(port, () => {
        console.log(`Server listening on: http://localhost:${port}/`);
    });
} catch (error) {
    console.error(error);
}

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Define routes for categories, items, and subcategories, Mount the routers at the base URL
app.use(`${BASEURL}/`, categoryRouter, itemRouter, subRouter);

// Route for testing server status
app.use("/ok", (_req, _res) => {
    _res.status(200).send(httpResponse(true, "OK", {}));
});

// Middleware to handle route not found errors
app.use(routeNotFound);

// Middleware to handle other errors
app.use(errorHandler);

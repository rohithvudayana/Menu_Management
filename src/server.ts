import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./database/database"
import {routeNotFound} from "./middleware/routeNotFound";
import {errorHandler} from "./middleware/errorHandler"
import { httpResponse } from "./helpers/createResponse";

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

try{
    if(!process.env.CONNECTION)
        throw new Error("no connection string found in .env file");

    connectDB(process.env.CONNECTION);
    app.listen(port, () => {
        console.log(`server listening on : http://localhost:${port}/`);
    });
} catch (error) {
    console.error(error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ok", (_req, _res) => {  _res.status(200).send(httpResponse(true, "OK", {}))   })

app.use(routeNotFound);
app.use(errorHandler);
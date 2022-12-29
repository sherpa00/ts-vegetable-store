import * as dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";


// ___________________________________________ ENVIRONMENT VARIABLES _________________________________________
dotenv.config();

// mongo url
const MONGO_URL = process.env.MONGO_URL!;
// server port
const PORT = process.env.SERVER_PORT!;

// ____________________________________________ MONGODB SET _________________________________________
mongoose.set("strictQuery", true);


// ______________________________________________ SERVER AND DB CONNECTIONS ____________________________________________
// connect to mongodb atlas here
mongoose.connect(MONGO_URL,async () => {
    try {
        console.log("DB is connected successfully...");
        // server starts here
        app.listen(PORT,() : void => {
            console.log("Server is live at 3001...");
        })
    } catch (err) {
        throw new Error("Error while connecting to mongodb atlas db...")
    }
});


import express, { Express,Request,Response } from "express";
import morgan from "morgan";
import storeRoutes from "./routes/store.route";
import signupRoutes from "./routes/signup.route";

// ___________________ APPLICATION __________________
const app : Express = express();

// ___________________ MIDDLEWARES _________________
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(morgan("dev"));
app.set("view engine","ejs");

// __________________________ ROUTES _________________
app.get("/",(req:Request,res: Response) => {
    res.status(200).send("Success");
});

app.use("/store",storeRoutes);
app.use("/signup",signupRoutes);

export default app;
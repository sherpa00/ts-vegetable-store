
import express, { Express,Request,Response } from "express";
import morgan from "morgan";
import passport from "./configs/passport.config";
import storeRoutes from "./routes/store.route";
import signupRoutes from "./routes/signup.route";
import loginRoutes from "./routes/login.route";
<<<<<<< HEAD
=======
import { rmSync } from "fs";
>>>>>>> 9410fa899213ff629ca0fc319c61db9cc6efb137

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

app.get("/protected",passport.authenticate("jwt",{session: false}),(req: Request,res: Response) => {
    res.status(200).json({
        success: true,
        message: "You are authenticated and authorized"
    });
});

app.use("/store",storeRoutes);
app.use("/signup",signupRoutes);
app.use("/login",loginRoutes);

export default app;
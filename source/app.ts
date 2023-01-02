
import express, { Express,Request,Response } from "express";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "./configs/passport.config";
import storeRoutes from "./routes/store.route";
import signupRoutes from "./routes/signup.route";
import loginRoutes from "./routes/login.route";
import logoutRoutes from "./routes/logout.route";
import adminRoutes from "./routes/admin.route";


// ___________________ APPLICATION __________________
const app : Express = express();

//_______________________ STATIC FILES _________________
app.use(express.static(path.join(__dirname,"/public")));


// ___________________ MIDDLEWARES _________________
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan("dev"));
app.set("views",path.join(__dirname,"views"))
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

app.use("/store",passport.authenticate("jwt",{session: false}),storeRoutes);
app.use("/signup",signupRoutes);
app.use("/login",loginRoutes);
app.use("/logout",passport.authenticate("jwt",{session: false}),logoutRoutes);
app.use("/admin",passport.authenticate("jwt",{session: false}),adminRoutes);

export default app;
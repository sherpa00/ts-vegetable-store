import * as dotenv from "dotenv";

import express, { Express,NextFunction,Request,Response } from "express";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "./configs/passport.config";
import methodOveride from "method-override";

import storeRoutes from "./routes/store.route";
import signupRoutes from "./routes/signup.route";
import loginRoutes from "./routes/login.route";
import logoutRoutes from "./routes/logout.route";
import adminRoutes from "./routes/admin.route";
import cartRoutes from "./routes/cart.route";
import searchRoute from "./routes/search.route";
import settingsRoute from "./routes/settings.route";
import checkoutRoute from "./routes/checkout.route";
import orderRoute from "./routes/order.routes";

dotenv.config();

import isLoggedIn from "./middlewares/isLoggedIn.middleware";


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
app.use(methodOveride("_method")); // method override query string

// __________________________ ROUTES _________________
// render home page
app.get("/",isLoggedIn,(req:Request,res: Response) => {
    res.render("home");
});

app.get("/protected",passport.authenticate("jwt",{session: false,failureRedirect: "/login"}),(req: Request,res: Response,next: NextFunction) => {
    res.status(200).send("success");
})


app.use("/store",passport.authenticate("jwt",{session: false,failureRedirect: "/login"}),storeRoutes);
app.use("/signup",isLoggedIn,signupRoutes);
app.use("/login",isLoggedIn,loginRoutes);
app.use("/logout",passport.authenticate("jwt",{session: false,failureRedirect: "/login"}),logoutRoutes);
app.use("/admin",passport.authenticate("jwt",{session: false,failureRedirect: "/login"}),adminRoutes);
app.use("/cart",passport.authenticate("jwt",{session: false,failureRedirect: "/login"}),cartRoutes);
app.use("/search",passport.authenticate("jwt",{session: false,failureRedirect: "/login"}),searchRoute);
app.use("/settings",passport.authenticate('jwt',{session: false,failureRedirect: "/login"}),settingsRoute);
app.use("/checkout",passport.authenticate("jwt",{session: false,failureRedirect: "/login"}),checkoutRoute);
app.use("/orders",passport.authenticate("jwt",{session: false,failureRedirect: "/login"}),orderRoute);

export default app;
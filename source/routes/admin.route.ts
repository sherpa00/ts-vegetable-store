import { Router,Request,Response,NextFunction } from "express";
import isAdmin from "../middlewares/isAdmin.middleware";
import StoreModel from "../models/store.model";

// _____________________ ADMIN ROUTES _______________________
const router = Router();

router.get("/",isAdmin, async (req: Request,res: Response,next: NextFunction) => {
    // above miidleware validated user whether admin or not
    // this user is admin if this is successfully run
    console.log("Welcom Admin");

    // get all store products to pass to admin route render
    let products = await StoreModel.find({});

    res.render("admin",{products: products});
});

export = router;
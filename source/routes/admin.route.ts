import { Router,Request,Response,NextFunction } from "express";
import isAdmin from "../middlewares/isAdmin.middleware";

// _____________________ ADMIN ROUTES _______________________
const router = Router();

router.get("/",isAdmin,(req: Request,res: Response,next: NextFunction) => {
    // above miidleware validated user whether admin or not
    // this user is admin if this is successfully run
    console.log("Welcom Admin");
    res.render("admin");
});

export = router;
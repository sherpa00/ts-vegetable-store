import { Router,Request,Response,NextFunction } from "express";

// _____________________ ADMIN ROUTES _______________________
const router = Router();

router.get("/",(req: Request,res: Response,next: NextFunction) => {
    // validate if the user is admin or not
    let {isAdmin} : any = req.user;
    let userIsAdmin = isAdmin;
    
    if (userIsAdmin) {
        res.render("admin");
        next();
    } else {
        res.redirect("/login");
        next();
    }
    
});

export = router;
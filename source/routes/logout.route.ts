import { Request,Response,NextFunction, Router } from "express";

// __________________ LOGOUT ROUTES __________________
const router = Router();

router.get("/",(req: Request,res: Response,next: NextFunction) => {
    // check if user is authorized or not
    if (req.cookies['token']) {
        // clear the token cookie
        res.status(200).clearCookie("token").redirect("/");
    } else {
        res.redirect("/");
    };
});

export = router;
import  { Router,Request,Response } from "express";

// __________________________ SETTINGS ROUTE ______________________

const router = Router();

router.get("/",(req: Request,res: Response) : void => {
    // render settings views
    res.status(200).render("settings");
});


export = router;
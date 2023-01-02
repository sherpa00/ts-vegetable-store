import { Router,Request,Response } from "express";
import { body } from "express-validator";
import Login from "../controllers/login.controller";

// ______________________ LOGIN ROUTER __________________

const router = Router();

router.get("/",(req: Request,res: Response) => {
    res.render("login");
});
router.post("/",
    body("email").isEmail().withMessage("Email should be a valid email.").not().isEmpty().withMessage("Email should not be empty."),
    body("password").not().isEmpty().withMessage("Password should not be empty.").isLength({min: 6}).withMessage("Password lenght should be greaterm than 6."),
    Login);

export = router;
import { Router,Request,Response } from "express";
import { body,validationResult } from "express-validator";
import Signup from "../controllers/signup.controller";

const router = Router();

// ___________________ SIGNUP CONTROLLERS _______________
router.get("/",(req: Request,res: Response) => {
    res.render("signup");
})
router.post("/",
    // validation here
    body("username").not().isEmpty().withMessage("username should not be empty.").trim().escape(),
    body("email").isEmail().withMessage("Email should be a valid email.").not().isEmpty().withMessage("Email should not be empty."),
    body("password").isLength({min: 6}).withMessage("Password length should be greater than 6.").not().isEmpty().withMessage("Password should not be empty."),
    body("passwordRetyped").isLength({min: 6}).withMessage("Password length should be greater than 6.").not().isEmpty().withMessage("Password should not be empty."),
    Signup);

export = router;

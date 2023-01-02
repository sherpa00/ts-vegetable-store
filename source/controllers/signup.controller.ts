
import { Request,Response,NextFunction } from "express";
import { genSaltSync,hashSync } from "bcrypt";
import UserModel from "../models/user.model";
import { validationResult } from "express-validator/src/validation-result";
import { constants } from "buffer";

// ________________________________ SIGNUP CONTROLLERS _________________________
const Signup = async (req: Request,res: Response,next: NextFunction) => {
    try {
        //compare the password confirmation
        if (req.body.password !== req.body.passwordRetyped) {
            console.log("Password did not match");
            res.render("signup",{errors: {passwordRetyped: {msg: "Password did not match the confirmed password."}}});
            next();
            return;
        }
        // find validation errror in req.body
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Error while signing up");
            res.render("signup",{errors: errors.mapped()});
            next();
            return;
        }

        let salt = genSaltSync(10); // generate salt with 10 saltrounds;

        let hashedPassword = hashSync(req.body.password,salt); // hash the password from req.body with salt generted above;

        let newUserModel = new UserModel({
            username: req.body.username,
            email: req.body.email,
            salt: salt,
            hash: hashedPassword,
            isAdmin: false
        });

        await newUserModel.save();

        console.log("Signed up")
        res.status(200).redirect("/login");

    } catch (err) {
        res.status(400).send("Error while signing up");
        throw new Error("Error while signing up");
    };
    next();
}

export default Signup;
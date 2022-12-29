
import { Request,Response,NextFunction } from "express";
import { genSaltSync,hashSync } from "bcrypt";
import UserModel from "../models/user.model";

// ________________________________ SIGNUP CONTROLLERS _________________________
const Signup = async (req: Request,res: Response,next: NextFunction) => {
    try {

        let salt = genSaltSync(10); // generate salt with 10 saltrounds;

        let hashedPassword = hashSync(req.body.password,salt); // hash the password from req.body with salt generted above;

        let newUserModel = new UserModel({
            username: req.body.username,
            email: req.body.email,
            salt: salt,
            hash: hashedPassword,
            isAdmin: false
        });

        let user = await newUserModel.save();

        res.status(200).json(user);

    } catch (err) {
        res.status(400).send("Error while signing up");
        throw new Error("Error while signing up");
    };
    next();
}

export default Signup;
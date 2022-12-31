import * as dotenv from "dotenv";
import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { compareSync } from "bcrypt";
import fs from "fs";
import path from "path";
import UserModel from "../models/user.model";

// PRIVATE KEYS
const privateKey = fs.readFileSync(path.join(__dirname,"../configs/keys/private.key")).toString();

dotenv.config();
const SECRET : string = process.env.SECRET!;

// __________________________ LOGIN CONTROLLER _____________________

const Login = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // find the user with the help of cliet email
        let userByEmail = await UserModel.findOne({email: req.body.email});

        if (!userByEmail) {
            // if user's email is not found then compare the password hash
            res.status(400).send("User is not reigisterd yet");
            next();
        }

        // comapare the user's password
        let isValid = compareSync(req.body.password,userByEmail!.hash);


        // if password is valid then sign the jwt
        if (isValid) {
            // here sign the jwt
            let signed =  jwt.sign({sub: userByEmail!._id},privateKey,{expiresIn: "1h",algorithm: "RS256"});

            res.status(200).json({
                token: signed
            });
        } else {
            // if password not match 
            res.status(400).send("Password is incorrect");
        }


    } catch (err) {
        res.status(400).send("Error while loggin in.");
        console.log(err);
    }
}

export default Login;
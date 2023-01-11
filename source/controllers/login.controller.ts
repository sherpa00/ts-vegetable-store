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
            console.log("Email not found");
            res.render("login",{
                errors: {
                    email: {
                        msg: "Email or Password error."
                    },
                    password: {
                        msg: "Email or Password error."
                    }
                }
            });
            next();
            return;
        }

        // comapare the user's password
        let isValid = compareSync(req.body.password,userByEmail.hash);


        // if password is valid then sign the jwt
        if (isValid) {
            // here sign the jwt
            let signed =  jwt.sign({sub: userByEmail._id},privateKey,{expiresIn: "1h",algorithm: "RS256"});

            // verify if the user is admin or not
            if (userByEmail.isAdmin) {
                return res.cookie("token",signed,{
                    httpOnly: true,
                    maxAge: 6000000,
                    secure: false // only set true when https is used
                })
                .redirect("/admin");
            }

            // set the token to res.cookie
            return res.cookie("token",signed,{
                httpOnly: true,
                maxAge: 6000000,
                secure: false // only set true when https is used
            })
            .redirect("/store"); // redirect after login 

        } else {
            // if password not match 
            res.render("login",{
                errors: {
                    password: {
                        msg: "Email or Password error."
                    },
                    email: {
                        msg: "Email or Password error."
                    }
                }
            });
            next();
            return;
        }


    } catch (err) {
        res.status(400).send("Error while loggin in.");
        console.log(err);
    }
}

export default Login;
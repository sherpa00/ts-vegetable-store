import { compare, hash } from "bcrypt";
import { Request,Response,NextFunction } from "express";
import CartModel from "../models/cart.model";
import UserModel from "../models/user.model";

// __________________________ USER CONTROLLERS ____________________

// get the user
const GetUser = async (req: Request,res: Response,next: NextFunction) : Promise<void> => {
    try {
        // get the user's id from authenticated user req.user
        let {_id} : any = req.user!;
        let authenticatedUserId : string = _id;
        
        // find the user from usermodel with given above user id;
        let user = await UserModel.findById(authenticatedUserId);

        // user not found then redirect to store page
        if (!user) {
            console.log("user not found");
            res.redirect("/store");
            next();
            return;
        }

        console.log(user);
        next();

    } catch (err) {
        console.log(err);
        res.send("Error while getting the user");
    }
}

// update user's username
const UpdateUsername = async (req: Request,res: Response,next: NextFunction) : Promise<void> => {
    try {
        // get the user's id from authenticated user req.user
        let {_id} : any = req.user!;
        let authenticatedUserId : string = _id;

        // update the username from usermodel and req.body.username
        let user = await UserModel.findByIdAndUpdate(authenticatedUserId,{username: req.body.username},{new: true});

        console.log(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error while updating the username");
    }
}

// update user's email
const UpdateEmail = async (req: Request,res: Response,next: NextFunction) : Promise<void> => {
    try {
        // get the user's id from authenticated user req.user
        let {_id} : any = req.user!;
        let authenticatedUserId : string = _id;

        // update the email from usermodel and req.body.email
        let user = await UserModel.findByIdAndUpdate(authenticatedUserId,{email: req.body.email},{new: true});

        console.log(user);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error while updating the email");
    }
}

// update user's password
const UpdatePassword = async (req: Request,res: Response,next: NextFunction) : Promise<void> => {
    try {
        // get the user's id from authenticated user req.user
        let {_id} : any = req.user!;
        const authenticatedUserId : string = _id;

        // find the user from usermodel first to get the user's original passowrd hash and salt
        let UserById = await UserModel.findById(authenticatedUserId);

        // first compare the user's req.body.newPassword with the original password
        let isValid = await compare(UserById?.hash!,req.body.oldPassword);

        if (isValid) {
            let newHashedPassword = await hash(req.body.newPassword,UserById?.salt!);
            // update the password from usermodel and req.body.pass
            const user = await UserModel.findByIdAndUpdate(authenticatedUserId,{hash: newHashedPassword},{new: true});

            console.log(user);
        } else {
            console.log("User password not valid");
            res.redirect("/settings");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error while updating the username");
    }
}

// delete the user account
const DeleteAccount = async (req: Request,res: Response,next: NextFunction) : Promise<void> => {
    try {
        // get the user's id from authenticated user req.user
        let {_id} : any = req.user!;
        const authenticatedUserId : string = _id;

        // find the user from above userid to get the original password hash
        let UserById = await UserModel.findById(authenticatedUserId)

        // first verify the user's original given req.user.password from client
        let isValid = await compare(UserById?.hash!,req.body.password);

        if (isValid) {
            // secondly after validating user we can clear user's cart empty
            await CartModel.deleteMany({userId: authenticatedUserId});

            // then delete user account 
            let user = await UserModel.deleteOne({_id: authenticatedUserId});

            console.log(user);
        } else {
            console.log("User is not valid");
            res.redirect("/settings");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error while removing the user password");
    }
}

export {GetUser,UpdateUsername,UpdateEmail,UpdatePassword,DeleteAccount}
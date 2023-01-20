import { compare, hash } from "bcrypt";
import { Request,Response,NextFunction } from "express";
import CartModel from "../models/cart.model";
import OrderModel from "../models/orders.model";
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
        console.log("updated username");
        res.status(200).redirect("/settings");
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
        console.log("updated email");
        res.status(200).redirect("/settings");
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
        let isValid = await compare(req.body.oldPassword,UserById?.hash!);

        if (isValid) {
            let newHashedPassword = await hash(req.body.newPassword,UserById?.salt!);
            // update the password from usermodel and req.body.pass
            const user = await UserModel.findByIdAndUpdate(authenticatedUserId,{hash: newHashedPassword},{new: true});

            // after updating user password clear token cookies and redirect to login page
            console.log(user);
            console.log("Updated Password");
            res.status(200).clearCookie("token").redirect("/login");
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
        let isValid = await compare(req.body.password,UserById?.hash!);

        if (isValid) {
            // secondly after validating user we can clear user's cart empty
            await CartModel.deleteMany({userId: authenticatedUserId});

            // then delete user account 
            let user = await UserModel.deleteOne({_id: authenticatedUserId});

            // after removing account clear user account associated cookies
            console.log(user);
            console.log("Deleted User");
            res.clearCookie("token").status(200).redirect("/");
        } else {
            console.log("User is not valid");
            res.redirect("/settings");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error while removing the user password");
    }
}

const DeleteUserByAdmin = async (req: Request,res: Response,next: NextFunction) : Promise<void> => {
    try {
        // get the userid from req.params
        const userId : string = req.params.id;

        // first delete cart of the user
        await CartModel.deleteMany({userId: userId});

        // secondldy delete orders of the user
        await OrderModel.deleteMany({userId: userId});

        // then delete user 
        await UserModel.findByIdAndDelete(userId);

        console.log("User is deleted by admin");
        res.status(200).redirect("/admin");
    } catch (err) {
        console.log(err);
        res.redirect("/admin");
    }
}

export {GetUser,UpdateUsername,UpdateEmail,UpdatePassword,DeleteAccount,DeleteUserByAdmin}
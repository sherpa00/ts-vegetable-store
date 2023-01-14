import  { Router,Request,Response } from "express";
import { DeleteAccount, UpdateEmail, UpdatePassword, UpdateUsername } from "../controllers/user.controller";
import UserModel from "../models/user.model";

// __________________________ SETTINGS ROUTE ______________________

const router = Router();

router.get("/",async (req: Request,res: Response) : Promise<void> => {
    try {   
        // get the user's id from authenticated user req.user
        let {_id} : any = req.user!;
        let authenticatedUserId : string = _id;
        
        // find the user from usermodel with given above user id;
        let user = await UserModel.findById(authenticatedUserId);

        // render setttngs views with user profiles
        res.status(200).render("settings",{user: user});

    } catch (err) {
        console.log(err);
        res.send("Error while fetching the user");
    }
});

router.patch("/account/update/username",UpdateUsername);
router.patch("/account/update/email",UpdateEmail);
router.patch("/account/update/password",UpdatePassword);

router.delete("/account/delete",DeleteAccount);


export = router;
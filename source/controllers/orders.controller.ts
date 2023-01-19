import { Request,Response,NextFunction } from "express";
import OrderModel from "../models/orders.model";


// _________________________ ORDER ROUTES _______________________
const GetUserOrder = async (req: Request,res: Response,next: NextFunction) : Promise<void> => {
    try {
        // get the authenticated user's id
        let {_id} : any = req.user!;
        let authenticatedUserId : string = _id;

        let userOrders = await OrderModel.find({userId: authenticatedUserId});

        console.log(userOrders);
        res.status(200).render('order',{
            orders: userOrders
        });
        next();
    } catch (err) {
        console.log(err);
        res.status(500).send("Error while geting user's orders.")
    }
}



export {GetUserOrder};
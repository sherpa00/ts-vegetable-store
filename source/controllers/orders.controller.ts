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

// update order to be accepted
const AcceptOrder = async (req: Request,res: Response,next: NextFunction) : Promise<void> => {
    try {
        // get orderId
        const orderId : string = req.params.id;

        await OrderModel.findByIdAndUpdate(orderId,{$set: {status: "Accepted and Sent"}});

        console.log("Accepted and sent order");
        res.status(200).redirect('/admin');
    } catch (err) {
        console.log(err);
        res.redirect('/admin');
    }
}

// update order to be received
const ReceivedOrder = async (req: Request,res: Response,next: NextFunction) : Promise<void> => {
    try {
        // get orderId
        const orderId : string = req.params.id;

        await OrderModel.findByIdAndUpdate(orderId,{$set: {status: "Received"}});

        console.log("Received order");
        res.status(200).redirect('/admin');
    } catch (err) {
        console.log(err);
        res.redirect('/admin');
    }
}

// delete order
const DeleteOrder = async (req: Request,res: Response,next: NextFunction) : Promise<void> => {
    try {
        // get the orderid
        const orderId : string = req.params.id;

        await OrderModel.findByIdAndDelete(orderId);

        console.log("Deleted Order");
        res.status(200).redirect("/admin");
    } catch (err) {
        console.log(err);
        res.redirect('admin');
    }
}



export {GetUserOrder,AcceptOrder,DeleteOrder,ReceivedOrder};
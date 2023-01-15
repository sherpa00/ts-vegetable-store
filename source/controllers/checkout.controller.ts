import { Request,Response,NextFunction } from "express";
import CartModel from "../models/cart.model";

// _______________________ CHECKOUT CONTORLLER ____________________

const GetCheckout = async (req: Request,res: Response,next: NextFunction) : Promise<void> => {
    try {
        // get the authenticated user's id
        let {_id} : any = req.user!;
        let authenticatedUserId : string = _id;

        // find the cart
        let cart = await CartModel.find({userId: authenticatedUserId});

        // compute cart total price and shipping fee
        let subtotal : number = 0,shipping_fee: number = 0;

        if (cart && cart.length > 0) {
            cart.forEach((cartItem) => {
                subtotal += cartItem.total_sum;
            });
            shipping_fee = 100;
        }

        // total price calculated from subtotal and shipping fee;
        let total_price : number = subtotal + shipping_fee;

        // render the checkout views
        res.status(200).render("checkout",{carts: cart,cartBill: {subtotal: subtotal,shipping_fee: shipping_fee,total_price: total_price}});
    } catch (err) {
        console.log(err);
        res.status(500).send("Error while gettting checkout");
    }
}

export {GetCheckout};
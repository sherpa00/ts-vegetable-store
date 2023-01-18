
import { Request,Response,NextFunction } from "express";
import CartModel from "../models/cart.model";
import OrderModel from "../models/orders.model";
import StoreModel from "../models/store.model";


// delivery details types
export type DeliveryDetails = {
    country: string,
    firstname: string,
    lastname: string,
    address: string,
    postcode: number,
    city: string,
    street: string,
    phone_number: number,
    delivery_note: string
};

// bill types
export type Bill = {
    subtotal: number,
    shipping_fee: number,
    total: number
}

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

// post checout with order details
const CheckOutOrder = async (req: Request,res: Response,next: NextFunction) : Promise<void> => {
    try {
        // get the authenticated user's id
        let {_id,email} : any = req.user!;
        let authenticatedUserId : string = _id;
        let authenticatedEmail : string = email;

        
        // get the delivery details from req.body containing delivery details like country , city , first_name ....
        let deliveryDetails : DeliveryDetails = req.body;

        // get the products to be ordered from cart of authenticated user
        let orderedProducts = await CartModel.find({userId: authenticatedUserId});


        // if the product is empty then return to /store to shop products
        if (!orderedProducts) {
            console.log("Cart is empty");
            res.status(200).redirect("/store");
            next();
        }

        // get the cart's bill amount 
        let subtotal : number = 0,shipping_fee: number = 0,total: number = 0;

        orderedProducts.forEach((prod) => {
            subtotal += prod.total_sum;
        });

        shipping_fee = 100;

        total = subtotal + shipping_fee;

        let bill : Bill = {
            subtotal: subtotal,
            shipping_fee: shipping_fee,
            total: total
        };

        let orderObject = {
            userId: authenticatedUserId,
            delivery_details: {...deliveryDetails},
            bill: bill
        } 

        // create a new order
        let order = new OrderModel(orderObject);

        let savedOrder = await order.save();

        // after creating the order delete your cart and sync the product's quantity
        orderedProducts.forEach(async (product) => {
            // here calculate max_quantity left after ordering the product
            let maxQuantityLeft : number = product.product.max_quantity - product.product_quantity;
            await StoreModel.findByIdAndUpdate(product.product._id,{max_quantity: maxQuantityLeft});
        });
        // here empty the cart;
        await CartModel.deleteMany({userId: authenticatedUserId});

        console.log(savedOrder);
        console.log("Added order");
        res.status(200).redirect("/store");
        
    } catch (err) {
        console.log(err);
        res.status(500).send("error while checking out the order");
    }
}

export {GetCheckout,CheckOutOrder};
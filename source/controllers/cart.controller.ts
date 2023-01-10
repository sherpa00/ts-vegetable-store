import { Request,Response,NextFunction } from "express";
import CartModel from "../models/cart.model";
import StoreModel from "../models/store.model";

// ___________________ CART CONTROLLER _______________

// create cart
const createCart = async (req:Request,res:Response,next: NextFunction) => {
    try {
        let productId : string,quantity: number;

        if (!req.params.id) {
            console.log("Id not found");
            res.redirect("back");
            next();
        }

        productId = req.params.id;

        if (!req.body.quantity) {
            quantity = 1;
        } else {
            quantity = req.body.quantity;
        }

        // authenticated user's id
        let {_id} : any = req.user;
        let authenticatedUserId : string = _id;

        // here find the product from id
        const product = await StoreModel.findById(productId);

        // make the cart model here 
        let newCart = await new CartModel({
            userId: authenticatedUserId,
            product: {
                _id: product?._id,
                title: product?.title,
                description: product?.description,
                price: product?.price!,
                category: product?.category,
                image: product?.image,
                max_quantity: product?.max_quantity,
            },
            product_quantity: quantity,
            total_sum: product?.price! * quantity,
            checked: false
        });

        // save the model to db
        await newCart.save();

        console.log(newCart);
        console.log("Added to cart");
        res.redirect("back");

    } catch (err) {
        console.log(err);
        res.send("Error while creating cart")
        console.log("Error while creating cart");
    }
}


// get the cart
const getCart = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // get the authenticated user's id
        let {_id} : any = req.user;
        let authenticatedId : string = _id;

        let cart = await CartModel.findOne({userId: authenticatedId});

        res.status(200).render('cart',{cart: cart});
        console.log("got cart");
    } catch (err) {
        console.log(err);
        res.send("Error while getting cart'");
        console.log("Error while getting cart")
    }
}

// get the cart
const updateCart = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // get the authenticated user's id
        let {_id} : any = req.user;
        let authenticatedId : string = _id;

        // get the cart id
        let cartId : string = req.params.id;

        // get the cart from id;
        let cartById = await CartModel.findById(cartId);

        let cart = await CartModel.findOneAndUpdate({userId: authenticatedId,_id : cartId},{
            product_quantity: req.body.product_quantity,
             total_sum: cartById?.product!.price! * req.body.product_quantity
        });

        if (!cart) {
            console.log("cart not found");
            res.redirect("back");
            next();
        }

        res.status(200).json(cart);
        console.log("got cart");
    } catch (err) {
        console.log(err);
        res.send("Error while getting cart'");
        console.log("Error while getting cart")
    }
}

// get the cart
const deleteCart = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // get the authenticated user's id
        let {_id} : any = req.user;
        let authenticatedId : string = _id;
        
        // get the cart id
        let cartId : string = req.params.id;

        let cart = await CartModel.deleteOne({userId: authenticatedId, _id: cartId},{new: true});

        if (!cart) {
            console.log("cart not found");
            res.redirect("back");
            next();
        }

        res.status(200).json(cart);
        console.log("delted on cart");
    } catch (err) {
        console.log(err);
        res.send("Error while deleting one cart'");
        console.log("Error while deleting one cart")
    }
}

// get the cart
const deleteAllCart = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // get the authenticated user's id
        let {_id} : any = req.user;
        let authenticatedId : string = _id;

        let cart = await CartModel.deleteMany({userId: authenticatedId},{new: true});

        res.status(200).json(cart);
        console.log("deleted all cart");
    } catch (err) {
        console.log(err);
        res.send("Error while deleting all cart'");
        console.log("Error while deleting all cart")
    }
};

export {createCart,getCart,updateCart,deleteCart,deleteAllCart};


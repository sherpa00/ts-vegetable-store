import { Request,Response,NextFunction } from "express";
import CartModel from "../models/cart.model";
import StoreModel from "../models/store.model";

// ___________________ CART CONTROLLER _______________

// create cart
const createCart = async (req:Request,res:Response,next: NextFunction) => {
    try {
        let productInStoreId : string,quantity: number;

        if (!req.params.id) {
            console.log("Id not found");
            res.redirect("back");
            next();
        }

        // get the authenticated user's id
        let {_id} : any = req.user;
        let authenticatedUserId : string = _id;

        // get the product id from the req.params;
        productInStoreId = req.params.id;

        // validate if the productInStore is already in cart or not
        let productInStoreInCart = await CartModel.findOne({
            userId: authenticatedUserId,
            "product._id": productInStoreId
        });
        // if productInStore found then redirect it to cart route and restrict creating new cart
        if (productInStoreInCart) {
            console.log("Product already in cart");
            res.status(200).redirect("/cart");
            next();
            return;
        }

        if (!req.body.product_quantity) {
            quantity = 1;
        } else {
            quantity = req.body.product_quantity;
        }

        // here find the productInStore from id
        const productInStore = await StoreModel.findById(productInStoreId);

        // make the cart model here 
        let newCart = await new CartModel({
            userId: authenticatedUserId,
            product: {
                _id: productInStore?._id,
                title: productInStore?.title,
                description: productInStore?.description,
                price: productInStore?.price!,
                category: productInStore?.category,
                image: productInStore?.image,
                max_quantity: productInStore?.max_quantity,
            },
            product_quantity: quantity,
            total_sum: productInStore?.price! * quantity,
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


// get the cart plus cart summary too
const getCart = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // get the authenticated user's id
        let {_id} : any = req.user;
        let authenticatedId : string = _id;

        let cart = await CartModel.find({userId: authenticatedId});

        // here compute the cart summary
        let subtotal = 0, shipping = 0;
        // sum of all procuts in cart
        cart.forEach((cartItem) => {
            subtotal += cartItem.total_sum
        });
        // shipping fee
        if (cart.length > 0) {
            shipping = 100;
        }

        let cart_summary = {
            subtotal: subtotal,
            shipping_fee: shipping,
            total: subtotal + shipping
        }

        res.status(200).render('cart',{carts: cart,summary: cart_summary});
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

        res.status(200).redirect("/cart");
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

        res.status(200).redirect("/cart");
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


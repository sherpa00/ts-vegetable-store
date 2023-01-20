import { Router,Request,Response,NextFunction } from "express";
import { AcceptOrder, DeleteOrder, ReceivedOrder } from "../controllers/orders.controller";
import { DeleteUserByAdmin } from "../controllers/user.controller";
import isAdmin from "../middlewares/isAdmin.middleware";
import OrderModel from "../models/orders.model";
import StoreModel from "../models/store.model";
import UserModel from "../models/user.model";


// _____________________ ADMIN ROUTES _______________________
const router = Router();

router.get("/",isAdmin, async (req: Request,res: Response,next: NextFunction) => {
    // above miidleware validated user whether admin or not
    // this user is admin if this is successfully run
    console.log("----------------------");
    console.log("Welcome Admin");
    console.log("----------------------");

    // get all store products to pass to admin route render
    let products = await StoreModel.find({});

    // get all orders to pass to admin route render
    let orders = await OrderModel.find({});

    // get all usres to pass to admin route render
    let users = await UserModel.find({});

    res.render("admin",{
        products: products,
        orders: orders,
        users: users
    });
});

// admin store update routes
router.get("/product/update/:id",isAdmin,async (req: Request,res: Response, next: NextFunction) => {
    try {
        // first validate if the product exists or not by finding it with req.params.id
        let {id} = req.params;
        let findByIdProduct = await StoreModel.findById(id);

        // if product is not found redirect it to /admin
        if (!findByIdProduct) {
            console.log("Errro!! Product not found.")
            res.redirect("/admin");
            next();
        }

        // if product found then redner update page
        res.render("admin_prod_update",{params: id,product: findByIdProduct});
    } catch (err) {
        console.log(err);
        console.log("Product not valid");
        res.redirect('/admin');
    }
});

router.get("/orders/accept/:id",isAdmin,AcceptOrder);

router.get("/orders/received/:id",isAdmin,ReceivedOrder);

router.delete("/orders/delete/:id",isAdmin,DeleteOrder);

router.delete("/users/delete/:id",isAdmin,DeleteUserByAdmin);

export = router;
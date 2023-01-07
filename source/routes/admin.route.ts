import { Router,Request,Response,NextFunction } from "express";
import isAdmin from "../middlewares/isAdmin.middleware";
import StoreModel from "../models/store.model";

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

    res.render("admin",{products: products});
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
})

export = router;

import { Request,Response,NextFunction } from "express";
import StoreModel from "../models/store.model";

// type for req.body
type ReqBody = {
    title: string;
    description: string;
    price: number,
    category: string[],
    image: any,
    max_quantity: number
}



// ___________________ STORE CONTROLLERS ___________________

// CREATE a store product
const CreateStoreProduct = async (req: Request,res: Response,next: NextFunction) => {
    try {
        let productsCount = await StoreModel.find({});

        // if the post data does not consists of req.file image then redirect it to admin route
        if (!req.file) {
            res.redirect("/admin");
            next();
        };

        // factorize the req.body to be saved
        let reqBody : ReqBody = {
            title: req.body.title,
            description: req.body.description,
            price: Number(req.body.price),
            category: [],
            image: req.file,// add the req.file image
            max_quantity: Number(req.body.max_quantity)
        };
        console.log(reqBody);
        
        // finalize the category of products in an array
        if (req.body.fruit) {
            reqBody.category.push(req.body.fruit);
        }
        if (req.body.green_vegetable) {
            reqBody.category.push(req.body.green_vegetable);
        }
        if (req.body.vegetable) {
            reqBody.category.push(req.body.vegetable);
        }
        if (req.body.winter) {
            reqBody.category.push(req.body.winter);
        }
        if (req.body.summer) {
            reqBody.category.push(req.body.summer);
        }

        let newStoreModel = new StoreModel({
            ...reqBody,
            // calculate the length and create id
            id: productsCount.length + 1
        });

        await newStoreModel.save();

        console.log("Product is added"); 
        
        res.redirect("/admin");
    } catch (err) {
        res.status(400).send("Error while creating store product...")
        throw new Error("Error while creating a store product ...");
    }
    next();
}

// READ a store product
const GetStoreProduct = async (req: Request,res: Response,next: NextFunction) => {
    try {
        let store = await StoreModel.findById(req.params.id);
        console.log("Got a store product.");
        res.status(200).json(store);
    } catch (err) {
        res.status(400).send("Error while gettin a store product..")
        throw new Error("Error while getting a store product ....");
    }
    next();
}

// READ all store product
const GetAllStoreProduct = async (req: Request,res: Response,next: NextFunction) => {
    try {
        let store = await StoreModel.find({});
        console.log("Got all products");
        res.status(200).json(store);
    } catch (err) {
        res.status(400).send("Error while gettin store products..")
        throw new Error("Error while getting the store product ....");
    }
    next();
}

// UPDATE a store product
const UpdateStoreProduct = async (req: Request,res: Response,next: NextFunction) => {
    try {
        let store = await StoreModel.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.body.image,
            max_quantity: req.body.max_quantity
        },{new: true});

        res.status(200).json(store);
        console.log('Store product updated');
    } catch (err) {
        res.status(400).send("Error while updating store product");
        throw new Error("Error while updating the store product...");
    }
}


// DELETE a store product
const DeleteStoreProduct = async (req: Request,res: Response,next: NextFunction) => {
    try {
        let store = await StoreModel.findByIdAndRemove(req.params.id);
        console.log("Removed store product");
        res.status(200).json(store);
    } catch (err) {
        res.status(400).send("Error while removing a store product..")
        throw new Error("Error while removing a store product ....");
    }
    next();
}

// DELETE all store products
const DeleteAllStoreProduct = async (req: Request,res: Response,next: NextFunction) => {
    try {
        let store = await StoreModel.deleteMany({});
        console.log("Removed all products");
        res.status(200).json(store);
    } catch (err) {
        res.status(400).send("Error while removing all store products..")
        throw new Error("Error while removing all store product ....");
    }
    next();
}


export {CreateStoreProduct,GetStoreProduct,GetAllStoreProduct,UpdateStoreProduct,DeleteStoreProduct,DeleteAllStoreProduct};


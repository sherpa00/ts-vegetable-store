
import { Request,Response,NextFunction } from "express";
import path from "path";
import sharp from "sharp";
import { existsSync, readdir, unlinkSync} from "fs";
import StoreModel from "../models/store.model";
import CartModel from "../models/cart.model";

// type for req.body
type ReqBody = {
    title: string;
    description: string;
    price: number,
    type: string,
    category: string[],
    image: any,
    max_quantity: number
}

// ___________________ STORE CONTROLLERS ___________________

// CREATE a store product
const CreateStoreProduct = async (req: Request,res: Response,next: NextFunction) => {
    try {

        // if the post data does not consists of req.file image then redirect it to admin route
        if (!req.file) {
            res.redirect("/admin");
            next();
        };

        // function to replace to new format from the file path
        const replaceFormat = (file: string,oldFormat: any,newFormat: string) : string => {
            let resPath : string = file.replace(oldFormat,newFormat);
            return resPath;
        }

        let oldMimeFormat : any = req.file?.mimetype.split("/")[1];
        // new filename by replacing the old filename into jpeg format
        let newFileName = Date.now() + "-" + replaceFormat(req.file?.originalname!,oldMimeFormat,"jpeg");

        
        // image resizing and manipulation --> saved to resized folder
        const processedFile = await sharp(req.file?.buffer)
        .toFormat("jpeg")
        .jpeg({mozjpeg: true,quality: 100,chromaSubsampling: "4:4:4",force: true}) // conver to jpeg forcefully
        .resize(700,700,{fit: "cover"})
        .toFile(path.resolve(__dirname,"../public/uploads",newFileName));
        
        // image file object to be saved in database
        let imageFile = {
            path: `/uploads/${newFileName}`,
            filename: newFileName,
            ...processedFile
        };


        // factorize the req.body to be saved
        let reqBody : ReqBody = {
            title: req.body.title,
            description: req.body.description,
            price: Number(req.body.price),
            type: req.body.type,
            category: [],
            image: imageFile,// add the the image file oject
            max_quantity: Number(req.body.max_quantity)
        };
        
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
            ...reqBody
        });

        await newStoreModel.save();

        console.log("Product is added"); 
        
        res.redirect("/admin");
    } catch (err) {
        console.log(err);
        res.status(400).send("Error while creating store product...");
        
    }
    next();
}

// READ a store product
const GetStoreProduct = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // first validate if the product exists or not by finding it with req.params.id
        let {id} = req.params;
        let findByIdProduct = await StoreModel.findById(id);

        // if product is not found redirect it to /store
        if (!findByIdProduct) {
            console.log("Errro!! Product not found.")
            res.redirect("/store");
            next();
        }

        // get the authenticated user's id
        let {_id} : any = req.user!;
        let authenticatedUserId : string = _id;

        // also find the user's cart count
        let cart = await CartModel.find({userId: authenticatedUserId});

        console.log("Got a store product.");
        res.status(200).render('store_product',{product: findByIdProduct,cartCount: cart.length});
    } catch (err) {
        console.log(err);
        console.log("Error ! Product not valid.");
        res.redirect("/store");
    }
    next();
}

// READ all store product
const GetAllStoreProduct = async (req: Request,res: Response,next: NextFunction) => {
    try {
        let store = await StoreModel.find({});

        // get the authenticated user's id
        let {_id} : any = req.user!;
        let authenticatedUserId : string = _id;

        // also find the user's cart count
        let cart = await CartModel.find({userId: authenticatedUserId});

        console.log("Got all products");
        res.status(200).render("store",{
            products: store,
            cartCount: cart.length
        });
        
    } catch (err) {
        res.status(400).send("Error while gettin store products..")
        throw new Error("Error while getting the store product ....");
    }
    next();
}

// UPDATE a store product image
const UpdateProductImage = async (req: Request,res: Response,next: NextFunction) => {
    try {

        // if the post data does not consists of req.file image then redirect it to admin route
        if (!req.file) {
            res.redirect("/admin");
            next();
        };

        // first find the product and delete the product from filesystem
        const findProductById = await StoreModel.findById(req.params.id);

        unlinkSync(path.join(__dirname,`../public/${findProductById?.image.path!}`));
        console.log("Old Product image removed")

        // function to replace to new format from the file path
        const replaceFormat = (file: string,oldFormat: any,newFormat: string) : string => {
            let resPath : string = file.replace(oldFormat,newFormat);
            return resPath;
        }

        let oldMimeFormat : any = req.file?.mimetype!.split("/")[1];
        // new filename by replacing the old filename into jpeg format
        let newFileName = Date.now() + "-" + replaceFormat(req.file?.originalname!,oldMimeFormat,"jpeg");

        
        // image resizing and manipulation --> saved to resized folder
        const processedFile = await sharp(req.file?.buffer)
        .toFormat("jpeg")
        .jpeg({mozjpeg: true,quality: 100,chromaSubsampling: "4:4:4",force: true}) // conver to jpeg forcefully
        .resize(700,700,{fit: "cover"})
        .toFile(path.resolve(__dirname,"../public/uploads",newFileName));
        
        // image file object to be saved in database
        let imageFile = {
            path: `/uploads/${newFileName}`,
            filename: newFileName,
            ...processedFile
        };

        await StoreModel.findByIdAndUpdate(req.params.id,{
            image: imageFile
        });

        console.log("Product Image updated");
        res.status(200).redirect("/admin");
        
    } catch (err) {
        console.log(err);
        res.redirect("/admin");      
    }
}

// update product title
const UpdateProductTitle = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
    try {
        await StoreModel.findByIdAndUpdate(req.params.id,{
            title: req.body.title
        });
        console.log("Product Title updated");
        res.status(200).redirect("/admin");
    } catch (err) {
        console.log(err);
        res.redirect("/admin");
    }
}

// update product description
const UpdateProductDescription = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
    try {
        await StoreModel.findByIdAndUpdate(req.params.id,{
            description: req.body.description
        });
        console.log("Product Description updated");
        res.status(200).redirect("/admin");
    } catch (err) {
        console.log(err);
        res.redirect("/admin");
    }
}

// update product price
const UpdateProductPrice = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
    try {
        await StoreModel.findByIdAndUpdate(req.params.id,{
            price: req.body.price
        });
        console.log("Product Price updated");
        res.status(200).redirect("/admin");
    } catch (err) {
        console.log(err);
        res.redirect("/admin");
    }
}

// update product type
const UpdateProductType = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
    try {
        await StoreModel.findByIdAndUpdate(req.params.id,{
            type: req.body.type
        });
        console.log("Product type updated");
        res.status(200).redirect("/admin");
    } catch (err) {
        console.log(err);
        res.redirect("/admin");
    }
}

// update product max quantity
const UpdateProductMaxQuantity = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
    try {
        await StoreModel.findByIdAndUpdate(req.params.id,{
            max_quantity: req.body.max_quantity
        });
        console.log("Product Title updated");
        res.status(200).redirect("/admin");
    } catch (err) {
        console.log(err);
        res.redirect("/admin");
    }
}

// update product category
const UpdateProductCategory = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
    try {
        let reqBody = [];

        if (req.body.fruit) {
            reqBody.push(req.body.fruit);
        }
        if (req.body.green_vegetable) {
            reqBody.push(req.body.green_vegetable);
        }
        if (req.body.vegetable) {
            reqBody.push(req.body.vegetable);
        }
        if (req.body.winter) {
            reqBody.push(req.body.winter);
        }
        if (req.body.summer) {
            reqBody.push(req.body.summer);
        }

        await StoreModel.findByIdAndUpdate(req.params.id,{
            category: reqBody
        });

        console.log("Product Category updated");
        res.status(200).redirect("/admin");
    } catch (err) {
        console.log(err);
        res.redirect("/admin");
    }
}




// DELETE a store product
const DeleteStoreProduct = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // first find the product from produt id and delete it's image file from filesystem
        let findProductById = await StoreModel.findById(req.params.id);
        // finding out if the image file exists or not in filesystem;
        let isFound = existsSync(path.join(__dirname,`../public/${findProductById?.image.path!}`));
        
        if (isFound) {
            // if image file exists then delet the image file
            unlinkSync(path.join(__dirname,`../public/${findProductById?.image.path!}`));
            console.log("Product Image removed.");
        }

        // here delte doc from db
        await StoreModel.findByIdAndRemove(req.params.id);
        console.log("Removed store product");

        res.redirect("/admin");
        
    } catch (err) {
        res.status(400).send("Error while removing a store product..")
        console.log(err);
    }
    next();
}

// DELETE all store products
const DeleteAllStoreProduct = async (req: Request,res: Response,next: NextFunction) => {
    try {
        // first list the file from upload dir and delete sync 
        readdir(path.join(__dirname,"../public/uploads"), (err,files) => {
            if (err) throw err;

            for (let file of files) {
                unlinkSync(path.resolve(__dirname,"../public/uploads",file));
            }
            console.log("Removed all product images.");
        })

        await StoreModel.deleteMany({});
        console.log("Removed all products");
        
        res.redirect("/admin");
    } catch (err) {
        res.status(400).send("Error while removing all store products..")
        throw new Error("Error while removing all store product ....");
    }
    next();
}

// store product search
const SearchStoreProduct = async (req: Request,res: Response,next: NextFunction) => {
    try {

        // get the authenticated user's id
        let {_id} : any = req.user!;
        let authenticatedUserId : string = _id;

        // also find the user's cart count
        let cart = await CartModel.find({userId: authenticatedUserId});

        // if search query not found then show all products
        if (!req.query.q) {
            let store = await StoreModel.find({});
            res.render("search",{products: store,searchText: "",count: store.length,cartCount: cart.length});
            next();
            return;
        }

        // get the search params
        let searchText : any = req.query.q;

        let store = await StoreModel.find({$text: {$search: searchText}});

        res.status(200).render("search",{products: store,searchText: searchText,count: store.length,cartCount: cart.length});
        console.log("search results");
        console.log(store);
    } catch(err) {
        res.status(400).send("Error while searching store product");
        console.log(err);
    }
}


export {CreateStoreProduct,GetStoreProduct,GetAllStoreProduct,UpdateProductTitle,UpdateProductPrice,UpdateProductMaxQuantity,UpdateProductImage,UpdateProductDescription,UpdateProductType,UpdateProductCategory,DeleteStoreProduct,DeleteAllStoreProduct,SearchStoreProduct};


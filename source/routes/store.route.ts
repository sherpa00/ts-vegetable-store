import { Router } from "express";
import { CreateStoreProduct,DeleteAllStoreProduct,DeleteStoreProduct,GetAllStoreProduct, GetStoreProduct, UpdateProductTitle,UpdateProductMaxQuantity,UpdateProductPrice,UpdateProductImage,UpdateProductDescription,UpdateProductCategory, UpdateProductType } from "../controllers/store.controller";
import isAdmin from "../middlewares/isAdmin.middleware";
import upload from "../middlewares/upload.middleware";



// __________________ STORE ROUTES _______________
const router = Router();

// routes
router.get("/",GetAllStoreProduct);
router.get("/:id",GetStoreProduct);
router.post("/",upload.single("image"),CreateStoreProduct);
router.patch("/image/:id",upload.single("image"),UpdateProductImage);
router.patch("/title/:id",UpdateProductTitle);
router.patch("/description/:id",UpdateProductDescription);
router.patch("/price/:id",UpdateProductPrice);
router.patch("/type/:id",UpdateProductType);
router.patch("/max_quantity/:id",UpdateProductMaxQuantity);
router.patch("/category/:id",UpdateProductCategory);
router.delete("/",isAdmin,DeleteAllStoreProduct);
router.delete("/:id",isAdmin,DeleteStoreProduct);


export = router;
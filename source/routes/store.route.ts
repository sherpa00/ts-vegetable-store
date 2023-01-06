import { Router } from "express";
import { CreateStoreProduct,DeleteAllStoreProduct,DeleteStoreProduct,GetAllStoreProduct, GetStoreProduct, UpdateStoreProduct } from "../controllers/store.controller";
import isAdmin from "../middlewares/isAdmin.middleware";
import upload from "../middlewares/upload.middleware";



// __________________ STORE ROUTES _______________
const router = Router();

// routes
router.get("/",GetAllStoreProduct);
router.get("/:id",GetStoreProduct)
router.post("/",isAdmin,upload.single("image"),CreateStoreProduct);
router.patch("/:id",isAdmin,UpdateStoreProduct);
router.delete("/",isAdmin,DeleteAllStoreProduct);
router.delete("/:id",isAdmin,DeleteStoreProduct);


export = router;
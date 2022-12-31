import { Router } from "express";
import { CreateStoreProduct,DeleteAllStoreProduct,DeleteStoreProduct,GetAllStoreProduct, GetStoreProduct, UpdateStoreProduct } from "../controllers/store.controller";

// __________________ STORE ROUTES _______________
const router = Router();

// routes
router.get("/",GetAllStoreProduct);
router.get("/:id",GetStoreProduct)
router.post("/",CreateStoreProduct);
router.patch("/:id",UpdateStoreProduct);
router.delete("/",DeleteAllStoreProduct);
router.delete("/:id",DeleteStoreProduct);


export = router;
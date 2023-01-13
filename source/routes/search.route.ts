import { Router } from "express";
import { SearchStoreProduct } from "../controllers/store.controller";


const router = Router();

router.get("/",SearchStoreProduct);

export = router;
import { Router } from "express";
import {createCart, deleteAllCart, deleteCart, getCart, updateCart} from "../controllers/cart.controller";


// ________________ CART ROUTER ________________
const router = Router();

router.get("/",getCart);
router.post("/:id",createCart);
router.patch("/:id",updateCart);
router.delete("/:id",deleteCart);
router.delete('/deleteall',deleteAllCart);

export = router;
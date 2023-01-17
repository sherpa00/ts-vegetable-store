import { Router } from "express";
import { CheckOutOrder, GetCheckout } from "../controllers/checkout.controller";

// ____________________ CHECKOUT ROUTES _______________________
const router = Router();

router.get("/",GetCheckout);
router.post("/",CheckOutOrder)

export = router;
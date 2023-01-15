import { Router } from "express";
import { GetCheckout } from "../controllers/checkout.controller";

// ____________________ CHECKOUT ROUTES _______________________
const router = Router();

router.get("/",GetCheckout);

export = router;
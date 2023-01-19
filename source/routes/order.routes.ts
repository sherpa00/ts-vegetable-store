import { Router } from "express";
import { GetUserOrder } from "../controllers/orders.controller";

// _______________________ ORDER ROUTES ___________________
const router = Router();

router.get("/",GetUserOrder);

export = router;
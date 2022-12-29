import { Router } from "express";
import Signup from "../controllers/signup.controller";

const router = Router();

// ___________________ SIGNUP CONTROLLERS _______________
router.post("/",Signup);

export = router;

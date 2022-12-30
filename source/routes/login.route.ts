import { Router } from "express";
import Login from "../controllers/login.controller";

// ______________________ LOGIN ROUTER __________________

const router = Router();

router.post("/",Login);

export = router;
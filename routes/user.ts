import { Router } from "express";
import ctrl from "../controllers/auth";

const router = Router();

router.post("/auth/signup", ctrl.signup);

router.post("/auth/signin", ctrl.signin);

export default router;

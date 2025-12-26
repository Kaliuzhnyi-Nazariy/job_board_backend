import { Router } from "express";
import ctrl from "../controllers/auth";
import middlewares from "../middlewares";

const router = Router();

router.post("/auth/signup", ctrl.signup);

router.post("/auth/signin", ctrl.signin);

router.post("/auth/signout", middlewares.isAuthenticated, ctrl.logout);

router.post("/auth/email-for-reset", ctrl.sendEmailForResetPassword);

router.post("/auth/reset-password", ctrl.changePassword);

export default router;

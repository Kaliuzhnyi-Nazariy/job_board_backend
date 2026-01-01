import { Router } from "express";
import authCtrl from "../controllers/auth";
import userCtrl from "../controllers/user";
import middlewares from "../middlewares";
import isAuthenticated from "../middlewares/authenticated";

const router = Router();

// auth

router.post("/auth/signup", authCtrl.signup);

router.post("/auth/signin", authCtrl.signin);

router.post("/auth/signout", middlewares.isAuthenticated, authCtrl.logout);

router.post("/auth/email-for-reset", authCtrl.sendEmailForResetPassword);

router.post("/auth/reset-password", authCtrl.changePassword);

// user

router.get("/get-me", isAuthenticated, userCtrl.getMe);

export default router;

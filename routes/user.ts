import { Router } from "express";
import authCtrl from "../controllers/auth";
import userCtrl from "../controllers/user";
import middlewares from "../middlewares";
import isAuthenticated from "../middlewares/authenticated";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = Router();

// auth

router.post("/auth/signup", authCtrl.signup);

router.post("/auth/signin", authCtrl.signin);

// router.post("/auth/signout", middlewares.isAuthenticated, authCtrl.logout);

router.post("/auth/email-for-reset", authCtrl.sendEmailForResetPassword);

router.post("/auth/reset-password", authCtrl.changePassword);

// user

router.get("/get-me", isAuthenticated, userCtrl.getMe);

router.patch("/change-password", isAuthenticated, userCtrl.changePassword);

router.delete("/delete", isAuthenticated, userCtrl.deleteAccount);

router.patch(
  "/photo",
  isAuthenticated,
  upload.single("photo"),
  userCtrl.updatePhoto,
);

router.delete("/photo", isAuthenticated, userCtrl.deletePhoto);

export default router;

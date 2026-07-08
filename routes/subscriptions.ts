import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middlewares";
import ctrl from "../controllers/subscription";
import express from "express";

const router = Router();

router.post(
  "/subscribe/webhook",
  express.raw({ type: "application/json" }),
  ctrl.subscribeHook,
);

router.use(isAuthenticated);
router.use(isAuthorized(["employer"]));

router.get("/my", ctrl.getMy);

router.get("/all", ctrl.getSubscriptions);

router.get("/invoices", ctrl.getInvoices);

router.get("/data/:subscriptionId", ctrl.getSubscriptionById);

router.post("/subscribe", ctrl.subscribe);

router.delete("/cancel/:subscriptionId", ctrl.cancel);

export default router;

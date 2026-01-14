import { Router } from "express";
import isAuthenticated from "../middlewares/authenticated";
import ctrl from "../controllers/application";

const router = Router();

router.post("/:jobId", isAuthenticated, ctrl.apply);

router.get(
  "/candidate-applications",
  isAuthenticated,
  ctrl.getCandidateApplies
);

export default router;

import { Router } from "express";
import isAuthenticated from "../middlewares/authenticated";
import ctrl from "../controllers/application";

const router = Router();

router.post("/:jobId", isAuthenticated, ctrl.apply);

router.get(
  "/candidate-applications",
  isAuthenticated,
  ctrl.getCandidateApplications,
);

router.get(
  "/candidate-applications/:jobApplicationId",
  isAuthenticated,
  ctrl.getCandidateApplciationDetails,
);

router.get("/get-applications/:jobId", isAuthenticated, ctrl.getApplications);

router.get(
  "/:jobId/candidate-details/:applicationId",
  isAuthenticated,
  ctrl.getApplicationDetails,
);

router.patch(
  "/update-candidate-status/:jobApplicationId",
  isAuthenticated,
  ctrl.updateApplicationStatus,
);

router.get("/candidate-recent", isAuthenticated, ctrl.getRecentApplications);

export default router;

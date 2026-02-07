import { Router } from "express";
import isAuthenticated from "../middlewares/authenticated";
import ctrl from "../controllers/application";

const router = Router();

//candidate

router.post("/:jobId", isAuthenticated, ctrl.applyToJob);

router.get("/my", isAuthenticated, ctrl.getMyApplications);

router.get("/my/count", isAuthenticated, ctrl.getMyApplicationsCount);

router.get("/my/:jobApplicationId", isAuthenticated, ctrl.getMyApplicationById);

router.get("/my/recent", isAuthenticated, ctrl.getMyRecentApplications);

// employer

router.get("/:jobId", isAuthenticated, ctrl.getApplicationsByJobId);

router.get(
  "/:jobId/candidate-details/:applicationId",
  isAuthenticated,
  ctrl.getApplicationDetails,
);

router.patch(
  "/:jobApplicationId/status",
  isAuthenticated,
  ctrl.updateApplicationStatus,
);

export default router;

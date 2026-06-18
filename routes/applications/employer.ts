import { Router } from "express";
import { isAuthorized } from "../../middlewares";
import ctrl from "../../controllers/application";

const router = Router();

router.get("/:jobId", isAuthorized(["employer"]), ctrl.getApplicationsByJobId);

router.get(
  "/:jobId/candidate-details/:applicationId",
  isAuthorized(["employer"]),
  ctrl.getApplicationDetails,
);

router.patch(
  "/:jobApplicationId/status",
  isAuthorized(["employer"]),
  ctrl.updateApplicationStatus,
);

export default router;

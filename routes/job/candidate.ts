import { Router } from "express";
import jobController from "../../controllers/job";
import { isAuthorized } from "../../middlewares";

const router = Router();

router.get("/jobs", isAuthorized(["candidate"]), jobController.getJobs);

router.get(
  "/jobs/:jobId",
  isAuthorized(["candidate"]),
  jobController.getJobById,
);

export default router;

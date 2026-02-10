import { Router } from "express";
import isAuthenticated from "../middlewares/authenticated";
import jobController from "../controllers/job";

const router = Router();

router.post("/post", isAuthenticated, jobController.postJob);

router.get("/my-jobs", isAuthenticated, jobController.getMyJobs);

router.get(
  "/my-jobs/five-recent",
  isAuthenticated,
  jobController.getFiveRecentJobs,
);

// router.get("/my-jobs/recent", isAuthenticated, jobController.getRecentJobs);

router.get("/my-jobs/:jobId", isAuthenticated, jobController.getMyJobById);

router.put("/update/:jobId", isAuthenticated, jobController.updateJob);

router.delete("/delete/:jobId", isAuthenticated, jobController.deleteJob);

// candidate

router.get("/jobs", isAuthenticated, jobController.getJobs);

router.get("/jobs/:jobId", isAuthenticated, jobController.getJobById);

export default router;

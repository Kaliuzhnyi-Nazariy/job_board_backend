import { Router } from "express";
import jobController from "../../controllers/job";
import { isAuthorized } from "../../middlewares";

const router = Router();

router.use(isAuthorized(["employer"]));

router.post("/post", jobController.postJob);

router.get("/my-jobs", jobController.getMyJobs);

router.get(
  "/my-jobs/five-recent",

  jobController.getFiveRecentJobs,
);

// router.get("/my-jobs/recent", jobController.getRecentJobs);

router.get("/my-jobs/:jobId", jobController.getMyJobById);

router.put("/update/:jobId", jobController.updateJob);

router.delete("/delete/:jobId", jobController.deleteJob);

export default router;

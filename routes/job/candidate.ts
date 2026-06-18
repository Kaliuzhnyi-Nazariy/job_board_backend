import { Router } from "express";
import jobController from "../../controllers/job";
import { isAuthorized } from "../../middlewares";

const router = Router();

router.use(isAuthorized(["candidate"]));

router.get("/jobs", jobController.getJobs);

router.get("/jobs/:jobId", jobController.getJobById);

export default router;

import { Router } from "express";
import { isAuthorized } from "../../middlewares";
import ctrl from "../../controllers/application";

const router = Router();

router.use(isAuthorized(["candidate"]));

//candidate

router.get("/my", ctrl.getMyApplications);

router.get("/my/count", ctrl.getMyApplicationsCount);

router.get("/my/recent", ctrl.getMyRecentApplications);

router.get("/my/:jobApplicationId", ctrl.getMyApplicationById);

router.post("/:jobId", ctrl.applyToJob);

export default router;

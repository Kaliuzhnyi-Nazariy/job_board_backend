import { Router } from "express";
import isAuthenticated from "../middlewares/authenticated";
import multer from "multer";
import ctrl from "../controllers/cv";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.use(isAuthenticated);

router.post("/", upload.single("resume"), ctrl.uploadCV);

router.delete("/:cvId", ctrl.deleteCV);

router.put("/:cvId", upload.single("resume"), ctrl.updateCVFile);

router.get("/:cvId/download", ctrl.getPresignedURL);

router.get("/", ctrl.getMyCVs);

export default router;

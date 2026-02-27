import { Router } from "express";
import isAuthenticated from "../middlewares/authenticated";
import multer from "multer";
import ctrl from "../controllers/cv";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post("/", isAuthenticated, upload.single("resume"), ctrl.uploadCV);

router.delete("/", isAuthenticated, ctrl.deleteCV);

router.put(
  "/:cvId",
  isAuthenticated,
  upload.single("resume"),
  ctrl.updateCVFile,
);

router.get("/:cvId/download", isAuthenticated, ctrl.getPresigndURL);

router.get("/", isAuthenticated, ctrl.getMyCVs);

export default router;

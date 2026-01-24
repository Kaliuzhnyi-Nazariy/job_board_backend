import { Router } from "express";
import isAuthenticated from "../middlewares/authenticated";
import candidateCtrl from "../controllers/candidate";

const router = Router();

router.get("/", isAuthenticated, candidateCtrl.getCandidates);

router.get("/:candidateId", isAuthenticated, candidateCtrl.getCandidate);

router.patch(
  "/update-personal",
  isAuthenticated,
  candidateCtrl.updateCandidatePersonal,
);

router.patch(
  "/update-profile",
  isAuthenticated,
  candidateCtrl.updateCandidateProfile,
);

export default router;

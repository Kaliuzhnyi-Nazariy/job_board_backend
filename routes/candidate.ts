import { Router } from "express";
import isAuthenticated from "../middlewares/authenticated";
import candidateCtrl from "../controllers/candidate";

const router = Router();

router.get("/", isAuthenticated, candidateCtrl.getCandidates);

router.get("/:candidateId", isAuthenticated, candidateCtrl.getCandidate);

export default router;

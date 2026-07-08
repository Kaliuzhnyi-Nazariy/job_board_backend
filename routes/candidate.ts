import { Router } from "express";
import isAuthenticated from "../middlewares/authenticated";
import candidateCtrl from "../controllers/candidate";
import { isAuthorized } from "../middlewares";

const router = Router();

router.use(isAuthenticated);

router.use(isAuthorized(["employer"]));

router.get("/", candidateCtrl.getCandidates);

router.get("/:candidateId", candidateCtrl.getCandidate);

router.patch("/update-personal", candidateCtrl.updateCandidatePersonal);

router.patch("/update-profile", candidateCtrl.updateCandidateProfile);

router.patch("/update-contact", candidateCtrl.updateContact);

export default router;

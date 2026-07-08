import { Router } from "express";
import isAuthenticated from "../../middlewares/authenticated";
import candidateRoutes from "./candidate";
import employerRoutes from "./employer";

const router = Router();

router.use(isAuthenticated);

router.use(candidateRoutes);
router.use(employerRoutes);

export default router;

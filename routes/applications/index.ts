import { Router } from "express";
import { isAuthenticated } from "../../middlewares";

import candidateRoutes from "./candidates";
import employerRoutes from "./employer";

const router = Router();

router.use(isAuthenticated);

router.use(candidateRoutes);
router.use(employerRoutes);

export default router;

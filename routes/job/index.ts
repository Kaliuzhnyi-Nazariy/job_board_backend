import { Router } from "express";
import isAuthenticated from "../../middlewares/authenticated";

const router = Router();

router.use(isAuthenticated);

export default router;

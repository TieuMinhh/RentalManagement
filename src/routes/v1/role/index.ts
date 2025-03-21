import { Router } from "express";
import { getRoles } from "./role.controller";

const router = Router();

router.get("/roles", getRoles);

export default router;

import { Router } from "express";
import { getTenants } from "./tenant.controller";

const router = Router();

router.get("/tenants", getTenants);

export default router;

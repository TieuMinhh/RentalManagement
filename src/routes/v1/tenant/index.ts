import { Router } from "express";
import {
  getTenants,
  getTenantsByID,
  getTenantsByUserID,
} from "./tenant.controller";

const router = Router();

router.get("/tenants", getTenants);
router.get("/tenant/by-id/:id", getTenantsByID);
router.get("/tenant/by-user-id/:user_id", getTenantsByUserID);

export default router;

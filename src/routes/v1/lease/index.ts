import { Router } from "express";
import {
  getLeases,
  getLeaseByID,
  getLeaseByTenantID,
} from "./lease.controller";

const router = Router();

router.get("/leases", getLeases);
router.get("/lease/by-id/:id", getLeaseByID);
router.get("/lease/by-tenant-id/:tenant_id", getLeaseByTenantID);

export default router;

import { Router } from "express";
import {
  getLeases,
  getLeaseByID,
  getLeaseByTenantID,
  approveLeaseRequest,
  signLease,
} from "./lease.controller";
import { authEmployee, authGuestOrTenant, authTenant } from "middlewares/auth";

const router = Router();

router.get("/leases", getLeases);
router.get("/lease/by-id/:id", getLeaseByID);
router.get("/lease/by-tenant-id/:tenant_id", getLeaseByTenantID);
router.post(
  "/lease/approve-lease-request/:request_id",
  authEmployee,
  approveLeaseRequest
);
router.put("/lease/sign-lease/:lease_id", authGuestOrTenant, signLease);

export default router;

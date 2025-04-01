import { Router } from "express";
import {
  getLeaseRequests,
  getLeaseByID,
  getLeaseByTenantID,
  requestLease,
  cancelLeaseRequest,
} from "./leaseRequest.controller";
import { authGuestOrTenant } from "middlewares/auth";

const router = Router();

router.get("/lease-requests", getLeaseRequests);
router.get("/lease-requests/by-id/:id", getLeaseByID);
router.get("/lease-requests/by-tenant-id/:tenant_id", getLeaseByTenantID);
router.post("/lease-requests/request-lease", authGuestOrTenant, requestLease);
router.put(
  "/lease-requests/cancel-request",
  authGuestOrTenant,
  cancelLeaseRequest
);

export default router;

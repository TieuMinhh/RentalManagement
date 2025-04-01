import { Router } from "express";
import { getPayments, processPayment } from "./payment.controller";
import { authTenant } from "middlewares/auth";

const router = Router();

router.get("/payments", getPayments);
router.post("/payments/process-payment", authTenant, processPayment);

export default router;

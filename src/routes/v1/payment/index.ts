import { Router } from "express";
import { getPayments } from "./payment.controller";

const router = Router();

router.get("/payments", getPayments);

export default router;

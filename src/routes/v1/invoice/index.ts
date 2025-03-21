import { Router } from "express";
import { getInvoices } from "./invoice.controller";

const router = Router();

router.get("/invoices", getInvoices);

export default router;

import { Router } from "express";
import { getInvoices, getInvoiceByID } from "./invoice.controller";

const router = Router();

router.get("/invoices", getInvoices);
router.get("/invoice/by-id/:id", getInvoiceByID);

export default router;

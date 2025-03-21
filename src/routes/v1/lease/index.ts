import { Router } from "express";
import { getLeases } from "./lease.controller";

const router = Router();

router.get("/leases", getLeases);

export default router;

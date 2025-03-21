import { Router } from "express";
import { getRoomTypes } from "./roomType.controller";

const router = Router();

router.get("/roomTypes", getRoomTypes);

export default router;

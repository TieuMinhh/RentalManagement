import { Router } from "express";
import { getRoomServices } from "./roomService.controller";

const router = Router();

router.get("/room-services", getRoomServices);

export default router;

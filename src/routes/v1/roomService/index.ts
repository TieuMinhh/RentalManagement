import { Router } from "express";
import { getRoomServices, setServiceToRoom } from "./roomService.controller";

const router = Router();

router.get("/room-services", getRoomServices);
router.post("/room-services/set-service-to-room", setServiceToRoom);

export default router;

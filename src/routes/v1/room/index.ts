import { Router } from "express";
import { getRooms, getRoomByID, getRoomWithServices } from "./room.controller";

const router = Router();

router.get("/rooms", getRooms);
router.get("/room/by-id/:id", getRoomByID);
router.get("/room-with-service", getRoomWithServices);

export default router;

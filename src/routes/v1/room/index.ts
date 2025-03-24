import { Router } from "express";
import { getRooms, getRoomByID, getRoomWithServices,createRoom,updateRoom } from "./room.controller";

const router = Router();

router.get("/rooms", getRooms);
router.get("/room/by-id/:id", getRoomByID);
router.get("/room-with-service", getRoomWithServices);
router.post("/room/create",createRoom)
router.put("/room/update/:id",updateRoom)

export default router;

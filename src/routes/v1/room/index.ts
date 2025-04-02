import { Router } from "express";
import {
  getRooms,
  getRoomByID,
  getRoomWithServices,
  createRoom,
  updateRoom,
  addImagesForRoom,
  updateImagesForRoom,
} from "./room.controller";
import { authEmployee } from "middlewares/auth";

const router = Router();

router.get("/rooms", getRooms);
router.get("/room/by-id/:id", getRoomByID);
router.get("/room-with-service", getRoomWithServices);
router.post("/room/create", authEmployee, createRoom);
router.put("/room/update/:id", authEmployee, updateRoom);
router.post("/room/add-images/:room_id", authEmployee, addImagesForRoom);
router.put("/room/update-images/:room_id", authEmployee, updateImagesForRoom);

export default router;

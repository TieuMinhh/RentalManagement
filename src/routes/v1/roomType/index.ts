import { Router } from "express";
import {
  getRoomTypes,
  getRoomTypeByID,
  createRoomType,
  updateRoomType,
  lockRoomType,
  unLockRoomType,
} from "./roomType.controller";

const router = Router();

router.get("/roomTypes", getRoomTypes);
router.get("/roomTypes/:id", getRoomTypeByID);
router.post("/roomTypes/create", createRoomType);
router.put("/roomTypes/update/:id", updateRoomType);
router.delete("/roomTypes/lock/:id", lockRoomType);
router.post("/roomTypes/un-lock/:id", unLockRoomType);

export default router;


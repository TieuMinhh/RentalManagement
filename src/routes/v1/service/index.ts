import { Router } from "express";
import { getServices, getServiceWithRooms } from "./service.controller";

const router = Router();

router.get("/services", getServices);
router.get("/service-with-room", getServiceWithRooms);

export default router;

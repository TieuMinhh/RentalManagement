import { Router } from "express";
import {
  getServices,
  getServiceWithRooms,
  createService,
  updateService,
  lockService,
  unLockService,
} from "./service.controller";

const router = Router();

router.get("/services", getServices);
router.get("/service-with-room", getServiceWithRooms);
router.post("/service/create", createService);
router.put("/service/update/:id", updateService);
router.delete("/service/lock/:service_id", lockService);
router.post("/service/unlock/:service_id", unLockService);

export default router;

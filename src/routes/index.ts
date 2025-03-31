import { Router } from "express";
import user from "./v1/user";
import role from "./v1/role";
import room from "./v1/room";
import auth from "./v1/auth";
import roomType from "./v1/roomType";
import service from "./v1/service";
import roomService from "./v1/roomService";
import employee from "./v1/employee";
import tenant from "./v1/tenant";
import lease from "./v1/lease";
import invoice from "./v1/invoice";
import payment from "./v1/payment";
import notification from "./v1/mailNotification";
import leaseRequest from "./v1/leaseRequest"
import maintenanceRecords from "./v1/maintenanceRecords";

const router = Router();

router.use("/api/v1", user);
router.use("/api/v1", role);
router.use("/api/v1", room);
router.use("/api/v1", auth);
router.use("/api/v1", roomType);
router.use("/api/v1", service);
router.use("/api/v1", roomService);
router.use("/api/v1", employee);
router.use("/api/v1", tenant);
router.use("/api/v1", lease);
router.use("/api/v1", invoice);
router.use("/api/v1", payment);
router.use("/api/v1", notification);
router.use("/api/v1", leaseRequest);
router.use("/api/v1", maintenanceRecords);

export default router;

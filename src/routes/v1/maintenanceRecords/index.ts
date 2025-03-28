import { Router } from "express";
import {
  getMaintenanceRecords,
  getMaintenanceRecordByID,
  createMaintenanceRecord,
  assignMaintenanceEmployee,
  completeMaintenance,
} from "./maintenanceRecords.controller";

const router = Router();

router.get("/maintenance-records", getMaintenanceRecords);
router.get("/maintenance-record/by-id/:id", getMaintenanceRecordByID);
router.post(
  "/maintenance-record/create-room-maintenance",
  createMaintenanceRecord
);
router.put("/maintenance-record/assign-employee", assignMaintenanceEmployee);
router.put(
  "/maintenance-record/complete-maintenance/:record_id",
  completeMaintenance
);

export default router;

import { Router } from "express";
import { getNotifications } from "./mailNotification.controller";

const router = Router();

router.get("/notifications", getNotifications);

export default router;

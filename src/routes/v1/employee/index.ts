import { Router } from "express";
import { getEmployees } from "./employee.controller";

const router = Router();

router.get("/employees", getEmployees);

export default router;

import { Router } from "express";
import { getUsers, getUserByID, getUserBySelf } from "./user.controller";
import { authAdmin, authEmployee, authTenant } from "middlewares/auth";

const router = Router();

router.get("/users", authAdmin, getUsers);
router.get("/user/by-id/:id", authEmployee, getUserByID);
router.get("/user/by-self", authTenant, getUserBySelf);

export default router;

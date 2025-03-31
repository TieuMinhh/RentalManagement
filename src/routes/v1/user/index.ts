import { Router } from "express";
import { getUsers,getUserBySelf } from "./user.controller";
import { authAdmin, authTenant } from "middlewares/auth";

const router = Router();

router.get("/users",authAdmin, getUsers);
router.get("/user/by-self",authTenant, getUserBySelf);

export default router;

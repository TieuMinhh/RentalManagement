import { Router } from "express";
import {
  logIn,
  refreshToken,
  signUp,
  changeInfo,
  changePassword,
  resetPasswordForUser,
  forgotPassword,
  resetPassword,
} from "./auth.controller";
import { authAdmin, authSystem } from "middlewares/auth";
// import schema from "./schema";
// import validator from "@helpers/validator";
// import { authAdmin } from "middlewares/auth";

const router = Router();

router.post(
  "/log-in",
  // validator(schema.login),
  logIn
);
router.post(
  "/sign-up",
  // validator(schema.signup),
  signUp
);
router.post(
  "/refresh-token",
  // validator(schema.refreshToken),
  refreshToken
);

router.put(
  "/change-info",
  authSystem,
  // validator(schema.changeInfo),
  changeInfo
);
router.put(
  "/change-password",
  authSystem,
  //   validator(schema.changePassword),
  changePassword
);
router.put("/reset-password/:userId", authAdmin, resetPasswordForUser);
router.post(
  "/forget-password",
  //   validator(schema.forgetPassword),
  forgotPassword
);
router.post(
  "/update-password",
  // validator(schema.resetPassword),
  resetPassword
);

export default router;

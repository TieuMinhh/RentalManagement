import { Router } from "express";
import {
  logIn,
  refreshToken,
  signUp,
//   refreshToken,
//   changeInfo,
//   changePassword,
//   resetPasswordForUser,
//   forgotPassword,
//   resetPassword,
}
from "./auth.controller";
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
// router.put(
//   "/change-password",
//   authUser,
//   //   validator(schema.changePassword),
//   changePassword
// );
// router.put(
//   "/change-info",
//   authUser,
//   // validator(schema.changeInfo),
//   changeInfo
// );
// router.put("/reset-password/:userId", authAdmin, resetPasswordForUser);
// router.post(
//   "/forget-password",
//   //   validator(schema.forgetPassword),
//   forgotPassword
// );
// router.post(
//   "/update-password",
//   // validator(schema.resetPassword),
//   resetPassword
// );

export default router;

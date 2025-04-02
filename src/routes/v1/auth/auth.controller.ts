import bcrypt from "bcrypt";
import crypto from "crypto";
import { Messages } from "@constants/response";
import asyncHandler from "../../../helpers/asyncHandler";
import UserRepo from "@repository/user.repo";
import VerificationRepo from "@repository/verification.repo";
import {
  createAccessToken,
  createRefreshToken,
  verifyToken,
} from "../../../utils/jwtUtils";
import {
  ForbiddenResponse,
  NotFoundResponse,
  SuccessResponse,
  AuthFailureResponse,
  BadRequestResponse,
} from "@utils/apiResponse";
import { UploadedFile } from "express-fileupload";
import { uploadFileToCloudinary } from "@utils/uploadFile";
import mail from "helpers/mail";

const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserRepo.findByEmail(email);

  if (!user)
    return new NotFoundResponse(Messages.auth.notExitAccount).send(res);
  if (user.status === "lock")
    return new ForbiddenResponse(Messages.auth.lockedAccount).send(res);

  const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
  if (!isPasswordCorrect)
    return new AuthFailureResponse(Messages.auth.wrongPassword).send(res);

  const role = { id: user.role?.id, name: user.role?.role_name };
  return new SuccessResponse(Messages.auth.loginSuccess, {
    accessToken: createAccessToken(user.id, role),
    refreshToken: createRefreshToken(user.id, role),
    userData: user,
  }).send(res);
});

const signUp = asyncHandler(async (req, res) => {
  const { email, full_name, password, phone } = req.body;
  const file = req.files?.avatar as UploadedFile;

  if (!email || !password || !full_name || !phone)
    return new BadRequestResponse(Messages.common.missingFields).send(res);

  const existingUser = await UserRepo.findByEmail(email);
  if (existingUser)
    return new BadRequestResponse(Messages.auth.exitEmail).send(res);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await UserRepo.create({
    email,
    full_name,
    password: hashedPassword,
    phone,
    role_id: 4,
  });

  if (newUser && file) {
    const imageUrl = await uploadFileToCloudinary(file);
    await UserRepo.update(newUser.id, { avatar: imageUrl });
    newUser.avatar = imageUrl;
  }

  return new SuccessResponse(Messages.auth.registerSuccess, {
    user: newUser,
  }).send(res);
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const decoded = verifyToken(refreshToken, true);
  if (!decoded)
    return new AuthFailureResponse(Messages.auth.invalidToken).send(res);

  const { id, role } = decoded;

  const user = await UserRepo.findByID(id);
  if (!user)
    return new NotFoundResponse(Messages.auth.notExitAccount).send(res);

  const newAccessToken = createAccessToken(id, role);
  const newRefreshToken = createRefreshToken(id, role);

  return new SuccessResponse(Messages.auth.successRefreshToken, {
    newAccessToken,
    newRefreshToken,
  }).send(res);
});

const changeInfo = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { name, email, phone } = req.body;
  const file = req.files?.avatar as UploadedFile;

  const user = await UserRepo.findByID(Number(userId));
  if (!user) return new NotFoundResponse(Messages.user.notFound).send(res);

  if (!name && !email && !phone)
    return new BadRequestResponse(Messages.user.noChangeInfo).send(res);

  if (email && email !== user.email) {
    const emailExists = await UserRepo.findByEmail(email);
    if (emailExists)
      return new BadRequestResponse(Messages.auth.exitEmail).send(res);
  }

  if (phone && phone !== user.phone) {
    const phoneExists = await UserRepo.findOne({ phone });
    if (phoneExists)
      return new BadRequestResponse(Messages.auth.exitPhone).send(res);
  }

  if (name) user.full_name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  if (user && file) {
    const imageUrl = await uploadFileToCloudinary(file);
    await UserRepo.update(user.id, { avatar: imageUrl });
    user.avatar = imageUrl;
  }

  await user.save();

  return new SuccessResponse(Messages.user.successChangeInfo, {
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
  }).send(res);
});

const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await UserRepo.findByID(Number(userId));
  if (!user) return new NotFoundResponse(Messages.user.notFound).send(res);

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch)
    return new AuthFailureResponse(Messages.auth.wrongOldPassWord).send(res);

  if (oldPassword === newPassword)
    return new ForbiddenResponse(
      Messages.auth.newPasswordCannotBeOldPassword
    ).send(res);

  if (newPassword !== confirmPassword)
    return new BadRequestResponse(Messages.auth.confirmPassword).send(res);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  return new SuccessResponse(Messages.auth.successChangePassword, {
    newPassword: hashedPassword,
  }).send(res);
});

const resetPasswordForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await UserRepo.findByID(Number(userId));
  if (!user) return new NotFoundResponse(Messages.user.notFound).send(res);

  const defaultPassword = "111111";
  user.password = await bcrypt.hash(defaultPassword, 10);
  await user.save();

  return new SuccessResponse(Messages.user.successResetPassword, {
    newPassword: user.password,
  }).send(res);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await UserRepo.findOne({ email });
  if (!user)
    return new NotFoundResponse(Messages.auth.notExitAccount).send(res);

  await VerificationRepo.deleteToken(user.id, "reset_password");

  const resetToken = crypto.randomBytes(32).toString("hex");

  await VerificationRepo.create({
    id_account: user.id,
    token: resetToken,
    type: "reset_password",
    expires_at: new Date(Date.now() + 15 * 60 * 1000),
  });

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await mail.sendResetPassword(user.email, resetLink);

  return new SuccessResponse(Messages.auth.successSendResetLink, {}).send(res);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const verification = await VerificationRepo.findValid(
    token,
    "reset_password"
  );

  if (!verification)
    return new BadRequestResponse(Messages.auth.invalidToken).send(res);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await UserRepo.update(verification.id_account, {
    password: hashedPassword,
  });

  await VerificationRepo.deleteToken(verification.id_account, "reset_password");

  return new SuccessResponse(Messages.user.successResetPassword, {}).send(res);
});

export {
  logIn,
  signUp,
  refreshToken,
  changeInfo,
  changePassword,
  resetPasswordForUser,
  forgotPassword,
  resetPassword,
};

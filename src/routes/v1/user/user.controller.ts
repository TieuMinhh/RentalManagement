import UserRepo from "@repository/user.repo";

import asyncHandler from "@helpers/asyncHandler";
import { SuccessResponse } from "@utils/apiResponse";

const getUsers = asyncHandler(async (req, res) => {
  const users = await UserRepo.findAll();
  return new SuccessResponse("Successful", {
    users,
  }).send(res);
});

const getUserByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserRepo.findByID(Number(id));
  return new SuccessResponse("Successful", {
    user,
  }).send(res);
});

const getUserBySelf = asyncHandler(async (req, res) => {
  const id = req.user?.id;
  const user = await UserRepo.findByID(Number(id));
  return new SuccessResponse("Successful", {
    user,
  }).send(res);
});

export { getUsers, getUserByID, getUserBySelf };

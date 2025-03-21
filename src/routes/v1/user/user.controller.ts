import UserRepo from "@repository/user.repo";

import asyncHandler from "@helpers/asyncHandler";
import { SuccessResponse } from "@utils/apiResponse";

const getUsers = asyncHandler(async (req, res) => {
  const users = await UserRepo.findAll();
  return new SuccessResponse("Successful", {
    users,
  }).send(res);
});

export { getUsers };

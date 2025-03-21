import RoleRepo from "@repository/role.repo";

import asyncHandler from "@helpers/asyncHandler";
import { SuccessResponse } from "@utils/apiResponse";

const getRoles = asyncHandler(async (req, res) => {
  const roles = await RoleRepo.findAll();
  return new SuccessResponse("Successful", {
    roles,
  }).send(res);
});

export { getRoles };

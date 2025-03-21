import TenantRepo from "@repository/tenant.repo";

import asyncHandler from "@helpers/asyncHandler";
import { SuccessResponse } from "@utils/apiResponse";

const getTenants = asyncHandler(async (req, res) => {
  const tenants = await TenantRepo.findAll();
  return new SuccessResponse("Successful", {
    tenants,
  }).send(res);
});

export { getTenants };

import TenantRepo from "@repository/tenant.repo";

import asyncHandler from "@helpers/asyncHandler";
import { BadRequestResponse, SuccessResponse } from "@utils/apiResponse";

const getTenants = asyncHandler(async (req, res) => {
  const tenants = await TenantRepo.findAll();
  return new SuccessResponse("Successful", {
    tenants,
  }).send(res);
});

const getTenantsByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tenant = await TenantRepo.findByID(Number(id));
  return new SuccessResponse("Successful", {
    tenant,
  }).send(res);
});

const getTenantsByUserID = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const tenant = await TenantRepo.findByUserID(Number(user_id));
  if (!tenant)
    return new BadRequestResponse("Không tìm thấy thông tin người thuê").send(
      res
    );
  return new SuccessResponse("Successful", {
    tenant,
  }).send(res);
});

export { getTenants, getTenantsByID, getTenantsByUserID };

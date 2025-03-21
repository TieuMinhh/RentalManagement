import LeaseRepo from "@repository/lease.repo";

import asyncHandler from "@helpers/asyncHandler";
import { SuccessResponse } from "@utils/apiResponse";

const getLeases = asyncHandler(async (req, res) => {
  const leases = await LeaseRepo.findAll();
  return new SuccessResponse("Successful", {
    leases,
  }).send(res);
});

export { getLeases };

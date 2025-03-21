import ServiceRepo from "@repository/service.repo";

import asyncHandler from "@helpers/asyncHandler";
import { SuccessResponse } from "@utils/apiResponse";

const getServices = asyncHandler(async (req, res) => {
  const services = await ServiceRepo.findAll();
  return new SuccessResponse("Successful", {
    services,
  }).send(res);
});

const getServiceWithRooms = asyncHandler(async (req, res) => {
  const serviceWithRooms = await ServiceRepo.getServiceWithRooms();
  return new SuccessResponse("Successful", {
    serviceWithRooms,
  }).send(res);
});

export { getServices, getServiceWithRooms };

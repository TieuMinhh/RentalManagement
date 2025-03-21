import RoomService from "@repository/roomService.repo";

import asyncHandler from "@helpers/asyncHandler";
import { SuccessResponse } from "@utils/apiResponse";

const getRoomServices = asyncHandler(async (req, res) => {
  const roomServices = await RoomService.findAll();
  return new SuccessResponse("Successful", {
    roomServices,
  }).send(res);
});

export { getRoomServices };

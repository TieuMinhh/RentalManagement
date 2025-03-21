import RoomTypeRepo from "@repository/roomType.repo";

import asyncHandler from "@helpers/asyncHandler";
import { SuccessResponse } from "@utils/apiResponse";

const getRoomTypes = asyncHandler(async (req, res) => {
  const roomTypes = await RoomTypeRepo.findAll();
  return new SuccessResponse("Successful", {
    roomTypes,
  }).send(res);
});

export { getRoomTypes };

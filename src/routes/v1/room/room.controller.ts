import RoomRepo from "@repository/room.repo";

import asyncHandler from "@helpers/asyncHandler";
import { NotFoundResponse, SuccessResponse } from "@utils/apiResponse";

const getRooms = asyncHandler(async (req, res) => {
  const rooms = await RoomRepo.findAll();
  return new SuccessResponse("Successful", {
    rooms,
  }).send(res);
});

const getRoomWithServices = asyncHandler(async (req, res) => {
  const roomsWithService = await RoomRepo.getRoomsWithServices();
  return new SuccessResponse("Successful", {
    roomsWithService,
  }).send(res);
});

const getRoomByID = asyncHandler(async (req, res) => {
  let { id } = req.params;
  const room = await RoomRepo.findByID(Number(id));
  if (!room) return new NotFoundResponse("Not found").send(res);
  return new SuccessResponse("Successful", {
    room,
  }).send(res);
});

export { getRooms, getRoomWithServices, getRoomByID };

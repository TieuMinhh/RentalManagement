import RoomService from "@repository/roomService.repo";

import asyncHandler from "@helpers/asyncHandler";
import { BadRequestResponse, SuccessResponse } from "@utils/apiResponse";
import roomRepo from "@repository/room.repo";
import serviceRepo from "@repository/service.repo";

const getRoomServices = asyncHandler(async (req, res) => {
  const roomServices = await RoomService.findAll();
  return new SuccessResponse("Successful", {
    roomServices,
  }).send(res);
});

const setServiceToRoom = asyncHandler(async (req, res) => {
  const { room_id, service_id } = req.body;

  const exitRoom = await roomRepo.findByID(room_id);
  if (!exitRoom) return new BadRequestResponse("Phòng không tồn tại").send(res);

  const exitService = await serviceRepo.findByID(service_id);
  if (!exitService)
    return new BadRequestResponse("Dịch vụ không tồn tại").send(res);

  const today = new Date().toISOString().split("T")[0];

  const exist = await RoomService.findOne({
    room_id,
    service_id,
    service_date: today,
  });

  if (exist)
    return new BadRequestResponse(
      "Dịch vụ đã được gán cho phòng này trong ngày rồi"
    ).send(res);

  const roomService = await RoomService.create({
    room_id,
    service_id,
  });

  return new SuccessResponse("Gán dịch vụ cho phòng thành công", {
    roomService,
  }).send(res);
});
export { getRoomServices, setServiceToRoom };

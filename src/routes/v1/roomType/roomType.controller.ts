import RoomTypeRepo from "@repository/roomType.repo";

import asyncHandler from "@helpers/asyncHandler";
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from "@utils/apiResponse";

const getRoomTypes = asyncHandler(async (req, res) => {
  const roomTypes = await RoomTypeRepo.findAll();
  return new SuccessResponse("Successful", {
    roomTypes,
  }).send(res);
});

const getRoomTypeByID = asyncHandler(async (req, res) => {
  let { id } = req.params;
  const roomType = await RoomTypeRepo.findByID(Number(id));
  if (!roomType) return new NotFoundResponse("Not found").send(res);
  return new SuccessResponse("Successful", {
    roomType,
  }).send(res);
});

const createRoomType = asyncHandler(async (req, res) => {
  const { type_name, description } = req.body;
  const exitTypeName = await RoomTypeRepo.findOne({ type_name });
  if (exitTypeName)
    return new BadRequestResponse("Tên loại phòng đã tồn tại").send(res);
  const createRoomType = await RoomTypeRepo.create({
    type_name,
    description,
  });
  return new SuccessResponse("Tạo loại phòng thành công", createRoomType).send(
    res
  );
});

const updateRoomType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type_name, description } = req.body;

  const exitRoomType = await RoomTypeRepo.findByID(Number(id));
  if (!exitRoomType)
    return new BadRequestResponse("Loại phòng không tồn tại").send(res);

  const exitTypeName = await RoomTypeRepo.findOne({ type_name });
  if (exitTypeName)
    return new BadRequestResponse("Tên loại phòng đã tồn tại").send(res);

  await RoomTypeRepo.update(Number(id), {
    type_name,
    description,
  });
  return new SuccessResponse("Cập nhật loại phòng thành công", {}).send(res);
});

const lockRoomType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const exitRoomType = await RoomTypeRepo.findByID(Number(id));
  if (!exitRoomType)
    return new BadRequestResponse("Loại phòng không tồn tại").send(res);

  const rooms = await RoomTypeRepo.checkTypeRoomHaveRoom({
    room_type_id: Number(id),
  });
  if (rooms.length > 0)
    return new BadRequestResponse(
      "Loại phòng đã có phòng nên không thể khóa"
    ).send(res);

  await RoomTypeRepo.lock(Number(id));
  return new SuccessResponse("Khoá loại phòng thành công", {}).send(res);
});

const unLockRoomType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const exitRoomType = await RoomTypeRepo.findByID(Number(id));
  if (!exitRoomType)
    return new BadRequestResponse("Loại phòng không tồn tại").send(res);

  await RoomTypeRepo.unLock(Number(id));
  return new SuccessResponse("Mở khoá loại phòng thành công", {}).send(res);
});

export {
  getRoomTypes,
  getRoomTypeByID,
  createRoomType,
  updateRoomType,
  lockRoomType,
  unLockRoomType,
};

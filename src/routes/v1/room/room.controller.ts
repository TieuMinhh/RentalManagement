import RoomRepo from "@repository/room.repo";

import asyncHandler from "@helpers/asyncHandler";
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from "@utils/apiResponse";
import RoomTypeRepo from "@repository/roomType.repo";
import RoomImageRepo from "@repository/roomImage.repo";
import { uploadFileToCloudinary } from "@utils/uploadFile";
import { UploadedFile } from "express-fileupload";

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

const createRoom = asyncHandler(async (req, res) => {
  const { name, room_type_id, price } = req.body;

  const exitRoomType = await RoomTypeRepo.findByID(room_type_id);
  if (!exitRoomType)
    return new BadRequestResponse("Loại phòng không tồn tại").send(res);

  if (exitRoomType.status === "lock")
    return new BadRequestResponse(
      "Loại phòng đang bị khoá, không thể tạo phòng mới"
    ).send(res);

  const exitNameRoom = await RoomRepo.findOne({ name });
  if (exitNameRoom)
    return new BadRequestResponse("Tên phòng đã tồn tại").send(res);

  const createRoom = await RoomRepo.create({
    name,
    room_type_id,
    price,
  });

  return new SuccessResponse("Tạo phòng thành công", createRoom).send(res);
});

const updateRoom = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, room_type_id, price } = req.body;

  const exitRoom = await RoomRepo.findByID(Number(id));
  if (!exitRoom) return new BadRequestResponse("Phòng không tồn tại").send(res);

  const exitRoomType = await RoomTypeRepo.findByID(room_type_id);
  if (!exitRoomType)
    return new BadRequestResponse("Loại phòng không tồn tại").send(res);

  if (exitRoomType.status === "lock")
    return new BadRequestResponse(
      "Loại phòng đang bị khoá, không thể cập nhật cho phòng này"
    ).send(res);

  const exitNameRoom = await RoomRepo.findOne({ name });
  if (exitNameRoom)
    return new BadRequestResponse("Tên phòng đã tồn tại").send(res);

  await RoomRepo.update(Number(id), {
    name,
    room_type_id,
    price,
  });
  return new SuccessResponse("Cập nhật phòng thành công", {}).send(res);
});

const addImagesForRoom = asyncHandler(async (req, res) => {
  const { room_id } = req.params;
  const files = req.files?.images as UploadedFile[];

  const room = await RoomRepo.findByID(Number(room_id));
  if (!room) return new NotFoundResponse("Phòng không tồn tại").send(res);

  const imageRecords = await Promise.all(
    files.map(async (file) => {
      const imageUrl = await uploadFileToCloudinary(file);
      return { room_id: room.id, image_url: imageUrl };
    })
  );

  await RoomImageRepo.addSomeImages(imageRecords);

  return new SuccessResponse("Thêm ảnh phòng thành công", imageRecords).send(
    res
  );
});

const updateImagesForRoom = asyncHandler(async (req, res) => {
  const { room_id } = req.params;
  const files = req.files?.images as UploadedFile[];

  const room = await RoomRepo.findByID(Number(room_id));
  if (!room) return new NotFoundResponse("Phòng không tồn tại").send(res);

  await RoomImageRepo.deleteByRoomId(room.id);

  const imageRecords = await Promise.all(
    files.map(async (file) => {
      const imageUrl = await uploadFileToCloudinary(file);
      return { room_id: room.id, image_url: imageUrl };
    })
  );

  await RoomImageRepo.addSomeImages(imageRecords);

  return new SuccessResponse(
    "Cập nhật ảnh phòng thành công",
    imageRecords
  ).send(res);
});

export {
  getRooms,
  getRoomWithServices,
  getRoomByID,
  createRoom,
  updateRoom,
  addImagesForRoom,
  updateImagesForRoom,
};

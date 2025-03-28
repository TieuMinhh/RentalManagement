import ServiceRepo from "@repository/service.repo";

import asyncHandler from "@helpers/asyncHandler";
import { BadRequestResponse, SuccessResponse } from "@utils/apiResponse";
import roomServiceRepo from "@repository/roomService.repo";
import { Op } from "sequelize";

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

const createService = asyncHandler(async (req, res) => {
  const { service_name, price } = req.body;
  const exitServiceName = await ServiceRepo.findOne({ service_name });
  if (exitServiceName)
    return new BadRequestResponse("Dịch vụ đã tồn tại").send(res);

  const createService = await ServiceRepo.create({
    service_name,
    price,
  });
  return new SuccessResponse("Tạo dịch vụ thành công", createService).send(res);
});

const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { service_name, price } = req.body;

  const exitService = await ServiceRepo.findByID(Number(id));
  if (!exitService)
    return new BadRequestResponse("Dịch vụ không tồn tại").send(res);

  const exitServiceName = await ServiceRepo.findOne({ service_name });
  if (exitServiceName)
    return new BadRequestResponse("Tên dịch vụ đã tồn tại").send(res);

  await ServiceRepo.update(Number(id), {
    service_name,
    price,
  });
  return new SuccessResponse("Cập nhật dịch vụ thành công", {}).send(res);
});

const lockService = asyncHandler(async (req, res) => {
  const { service_id } = req.params;

  const service = await ServiceRepo.findByID(Number(service_id));
  if (!service)
    return new BadRequestResponse("Dịch vụ không tồn tại").send(res);

  const today = new Date().toISOString().split("T")[0];

  // Dùng toán tử Op.gte (>=) và Op.lte (<=) để lọc chính xác các bản ghi trong ngày hôm nay.
  // Chỉ cần 1 bản ghi có service_date là ngày hiện tại thì sẽ không cho phép khoá dịch vụ.
  const roomServiceToday = await roomServiceRepo.findOne({
    service_id: Number(service_id),
    service_date: {
      [Op.gte]: `${today} 00:00:00`,
      [Op.lte]: `${today} 23:59:59`,
    },
  });

  if (roomServiceToday) {
    return new BadRequestResponse(
      "Không thể khoá dịch vụ ngay trong ngày kích hoạt"
    ).send(res);
  }

  await ServiceRepo.update(Number(service_id), { status: "lock" });

  return new SuccessResponse("Khoá dịch vụ thành công", {}).send(res);
});

const unLockService = asyncHandler(async (req, res) => {
  const { service_id } = req.params;

  const service = await ServiceRepo.findByID(Number(service_id));

  if (!service)
    return new BadRequestResponse("Dịch vụ không tồn tại").send(res);

  await ServiceRepo.update(Number(service_id), { status: "active" });

  return new SuccessResponse("Mở khoá dịch vụ thành công", {}).send(res);
});

export {
  getServices,
  getServiceWithRooms,
  createService,
  updateService,
  lockService,
  unLockService,
};

import MaintenanceRecordsRepo from "@repository/maintenanceRecords.repo";

import asyncHandler from "@helpers/asyncHandler";
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from "@utils/apiResponse";
import RoomRepo from "@repository/room.repo";

const getMaintenanceRecords = asyncHandler(async (req, res) => {
  const maintenanceRecords = await MaintenanceRecordsRepo.findAll();
  return new SuccessResponse("Successful", {
    maintenanceRecords,
  }).send(res);
});

const getMaintenanceRecordByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const maintenanceRecord = await MaintenanceRecordsRepo.findByID(Number(id));
  if (!maintenanceRecord)
    return new NotFoundResponse("Thông tin bảo trì không tồn tại").send(res);
  const maintenanceRecords = await MaintenanceRecordsRepo.findAll();
  return new SuccessResponse("Successful", {
    maintenanceRecords,
  }).send(res);
});

const createMaintenanceRecord = asyncHandler(async (req, res) => {
  const { room_id, description } = req.body;

  const room = await RoomRepo.findByID(Number(room_id));
  if (!room) return new BadRequestResponse("Phòng không tồn tại").send(res);

  if (room.status === "maintenance")
    return new BadRequestResponse("Phòng đang trong quá trình bảo trì").send(
      res
    );

  const roomUpdated = await RoomRepo.update(Number(room_id), {
    status: "maintenance",
  });
  if (!roomUpdated[0]) {
    return new BadRequestResponse("Cập nhật trạng thái phòng thất bại").send(
      res
    );
  }

  const maintenanceRecord = await MaintenanceRecordsRepo.create({
    room_id,
    description,
  });

  return new SuccessResponse("Tạo yêu cầu bảo trì thành công", {
    maintenanceRecord,
  }).send(res);
});

const assignMaintenanceEmployee = asyncHandler(async (req, res) => {
  const { record_id, employee_id } = req.body;

  const record = await MaintenanceRecordsRepo.findByID(Number(record_id));
  if (!record)
    return new BadRequestResponse("Yêu cầu bảo trì không tồn tại").send(res);

  if (record.status !== "pending")
    return new BadRequestResponse("Yêu cầu bảo trì đã được xử lý").send(res);

  await record.update({
    employee_id,
    status: "in_progress",
  });

  return new SuccessResponse("Đã chỉ định nhân viên thành công", {}).send(res);
});

const completeMaintenance = asyncHandler(async (req, res) => {
  const { record_id } = req.params;

  const record = await MaintenanceRecordsRepo.findByID(Number(record_id));
  if (!record)
    return new BadRequestResponse("Yêu cầu bảo trì không tồn tại").send(res);

  if (record.status !== "in_progress")
    return new BadRequestResponse(
      "Yêu cầu bảo trì chưa được chỉ định nhân viên"
    ).send(res);

  await record.update({ status: "completed" });

  const roomUpdated = await RoomRepo.update(Number(record?.room?.id), {
    status: "available",
  });
  if (!roomUpdated[0]) {
    return new BadRequestResponse("Cập nhật trạng thái phòng thất bại").send(
      res
    );
  }

  return new SuccessResponse("Hoàn tất bảo trì thành công", {}).send(res);
});

export {
  getMaintenanceRecords,
  getMaintenanceRecordByID,
  createMaintenanceRecord,
  assignMaintenanceEmployee,
  completeMaintenance,
};

import asyncHandler from "@helpers/asyncHandler";
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from "@utils/apiResponse";
import RoomRepo from "@repository/room.repo";
import TenantRepo from "@repository/tenant.repo";
import LeaseRequestRepo from "@repository/leaseRequest.repo";

const getLeaseRequests = asyncHandler(async (req, res) => {
  const leaseRequests = await LeaseRequestRepo.findAll();
  return new SuccessResponse("Successful", {
    leaseRequests,
  }).send(res);
});

const getLeaseByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const leaseRequest = await LeaseRequestRepo.findByID(Number(id));
  if (!leaseRequest)
    return new BadRequestResponse("Không tìm thấy yêu cầu thuê").send(res);
  return new SuccessResponse("Successful", {
    leaseRequest,
  }).send(res);
});

const getLeaseByTenantID = asyncHandler(async (req, res) => {
  const { tenant_id } = req.params;
  const leaseRequest = await LeaseRequestRepo.findByTenantID(Number(tenant_id));
  if (!leaseRequest)
    return new BadRequestResponse("Không tìm thấy yêu cầu thuê").send(res);
  return new SuccessResponse("Successful", {
    leaseRequest,
  }).send(res);
});

const requestLease = asyncHandler(async (req, res) => {
  const user_id = req.user?.id;
  const { room_id, start_date, end_date, rent_price, deposit, tenant_info } =
    req.body;

  const roomStatus = await RoomRepo.findByID(Number(room_id));
  if (roomStatus.status !== "available")
    return new BadRequestResponse(
      "Phòng đã có người thuê hoặc đang bảo trì"
    ).send(res);

  let tenant: any = await TenantRepo.findByUserID(Number(user_id));

  if (!tenant) {
    const existingTenant = await TenantRepo.findByIDCard(tenant_info.id_card);

    if (existingTenant)
      return new BadRequestResponse("CMND/CCCD này đã tồn tại").send(res);

    tenant = await TenantRepo.create({
      user_id,
      id_card: tenant_info.id_card,
      vehicle_plate: tenant_info.vehicle_plate,
    });
  } else {
    if (
      (tenant_info.id_card && tenant.id_card !== tenant_info.id_card) ||
      (tenant_info.vehicle_plate &&
        tenant.vehicle_plate !== tenant_info.vehicle_plate)
    ) {
      return new BadRequestResponse(
        "Thông tin người thuê không trùng khớp"
      ).send(res);
    }
  }

  const existingRequest = await LeaseRequestRepo.findPendingByTenantId(
    tenant.id
  );
  if (existingRequest)
    return new BadRequestResponse(
      "Bạn đã có yêu cầu thuê trọ đang chờ duyệt"
    ).send(res);

  const leaseRequest = await LeaseRequestRepo.create({
    tenant_id: tenant.id,
    room_id,
    start_date,
    end_date,
    rent_price,
    deposit,
  });

  return new SuccessResponse("Yêu cầu thuê trọ đã được gửi", {
    leaseRequest,
  }).send(res);
});

const cancelLeaseRequest = asyncHandler(async (req, res) => {
  const user_id = req.user?.id;

  const tenant: any = await TenantRepo.findByUserID(Number(user_id));
  if (!tenant)
    return new NotFoundResponse("Người thuê không tồn tại").send(res);

  const leaseRequest: any = await LeaseRequestRepo.findPendingByTenantId(
    tenant.id
  );
  if (!leaseRequest)
    return new BadRequestResponse(
      "Không có yêu cầu thuê nào đang chờ duyệt"
    ).send(res);

  await LeaseRequestRepo.updateStatus(leaseRequest.id, "canceled");

  return new SuccessResponse("Yêu cầu thuê trọ đã bị hủy", {}).send(res);
});

export {
  getLeaseRequests,
  getLeaseByTenantID,
  getLeaseByID,
  requestLease,
  cancelLeaseRequest,
};

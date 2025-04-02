import asyncHandler from "@helpers/asyncHandler";
import {
  BadRequestResponse,
  ForbiddenResponse,
  NotFoundResponse,
  SuccessResponse,
} from "@utils/apiResponse";
import RoomRepo from "@repository/room.repo";
import UserRepo from "@repository/user.repo";
import LeaseRepo from "@repository/lease.repo";
import InvoiceRepo from "@repository/invoice.repo";
import LeaseRequestRepo from "@repository/leaseRequest.repo";
import mail from "@helpers/mail";

const getLeases = asyncHandler(async (req, res) => {
  const leases = await LeaseRepo.findAll();
  return new SuccessResponse("Successful", {
    leases,
  }).send(res);
});

const getLeaseByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const lease = await LeaseRepo.findByID(Number(id));
  if (!lease)
    return new BadRequestResponse("Không tìm thấy hợp đồng thuê").send(res);
  return new SuccessResponse("Successful", {
    lease,
  }).send(res);
});

const getLeaseByTenantID = asyncHandler(async (req, res) => {
  const { tenant_id } = req.params;
  const lease = await LeaseRepo.findByTenantID(Number(tenant_id));
  if (!lease)
    return new BadRequestResponse("Không tìm thấy hợp đồng thuê").send(res);
  return new SuccessResponse("Successful", {
    lease,
  }).send(res);
});

const approveLeaseRequest = asyncHandler(async (req, res) => {
  const { request_id } = req.params;

  const leaseRequest: any = await LeaseRequestRepo.findByID(Number(request_id));
  if (!leaseRequest)
    return new NotFoundResponse("Yêu cầu thuê trọ không tồn tại").send(res);

  if (leaseRequest.status !== "pending")
    return new BadRequestResponse("Yêu cầu này đã được xử lý").send(res);

  await LeaseRequestRepo.updateStatus(Number(request_id), "approved");

  const lease: any = await LeaseRepo.create({
    room_id: leaseRequest.room?.id,
    tenant_id: leaseRequest.tenant?.id,
    lease_request_id: leaseRequest.id,
    start_date: leaseRequest.start_date,
    end_date: leaseRequest.end_date,
    rent_price: leaseRequest.rent_price,
    deposit: leaseRequest.deposit,
    balance_due: leaseRequest.rent_price - leaseRequest.deposit, // Số tiền còn lại phải thanh toán
    status: "pending",
  });

  await LeaseRequestRepo.updateLeaseID(Number(request_id), Number(lease.id));

  await mail.sendRoomRequestApproved(leaseRequest?.tenant?.user?.email);

  return new SuccessResponse(
    "Yêu cầu thuê trọ đã được duyệt, chờ người thuê ký",
    { lease }
  ).send(res);
});

const signLease = asyncHandler(async (req, res) => {
  const { lease_id } = req.params;
  const user_id = req.user?.id;

  const lease: any = await LeaseRepo.findByID(Number(lease_id));
  if (!lease) return new NotFoundResponse("Hợp đồng không tồn tại").send(res);

  if (lease.tenant?.user_id !== user_id)
    return new ForbiddenResponse("Bạn không thể ký hợp đồng này").send(res);

  if (lease.status !== "pending") {
    return new BadRequestResponse(
      "Hợp đồng không thể ký ở trạng thái hiện tại"
    ).send(res);
  }

  const totalAmount = parseFloat(
    (Number(lease.rent_price) - Number(lease.deposit)).toFixed(2)
  );

  await LeaseRepo.updateBalanceDue(lease.id, totalAmount);

  const invoice = await InvoiceRepo.create({
    lease_id: lease.id,
    invoice_date: new Date(),
    due_date: new Date(new Date().setDate(new Date().getDate() + 7)), // Hạn thanh toán sau 7 ngày
    total_amount: totalAmount,
    payment_status: "pending",
  });

  await LeaseRepo.updateStatus(Number(lease_id), "signed");

  await UserRepo.updateRole(Number(user_id), 3);

  await RoomRepo.updateStatus(lease.room?.id, "occupied");

  await mail.sendSignedLease(lease?.tenant?.user?.email);

  return new SuccessResponse("Hợp đồng đã được ký và hóa đơn đã được tạo", {
    lease_id,
    invoice,
  }).send(res);
});

const endLeaseByTenant = asyncHandler(async (req, res) => {
  const { lease_id } = req.params;
  const user_id = req.user?.id;

  const lease: any = await LeaseRepo.findByID(Number(lease_id));
  if (!lease) return new NotFoundResponse("Hợp đồng không tồn tại").send(res);

  if (lease.tenant?.user_id !== user_id)
    return new ForbiddenResponse(
      "Bạn không có quyền kết thúc hợp đồng này"
    ).send(res);

  if (lease.status === "terminated")
    return new BadRequestResponse("Hợp đồng này đã kết thúc rồi").send(res);

  if (lease.balance_due > 0)
    return new BadRequestResponse(
      "Không thể kết thúc hợp đồng vì còn nợ tiền phòng chưa đóng"
    ).send(res);

  await LeaseRepo.update(lease.id, {
    status: "terminated",
    end_date: new Date(),
  });

  await RoomRepo.updateStatus(lease.room?.id, "available");

  await mail.sendEndLease(lease?.tenant?.user?.email);

  return new SuccessResponse("Hợp đồng đã kết thúc thành công", {}).send(res);
});

const endLeaseByEmployee = asyncHandler(async (req, res) => {
  const { lease_id } = req.params;

  const lease: any = await LeaseRepo.findByID(Number(lease_id));
  if (!lease) return new NotFoundResponse("Hợp đồng không tồn tại").send(res);

  if (lease.status === "terminated")
    return new BadRequestResponse("Hợp đồng này đã kết thúc").send(res);

  if (lease.balance_due > 0)
    return new BadRequestResponse(
      "Không thể kết thúc hợp đồng vì còn nợ tiền phòng chưa đóng"
    ).send(res);

  await LeaseRepo.update(lease.id, {
    status: "terminated",
    end_date: new Date(),
  });

  await RoomRepo.updateStatus(lease.room?.id, "available");

  await mail.sendEndLease(lease?.tenant?.user?.email);

  return new SuccessResponse("Hợp đồng đã kết thúc thành công", {}).send(res);
});

export {
  getLeases,
  getLeaseByID,
  getLeaseByTenantID,
  approveLeaseRequest,
  signLease,
  endLeaseByTenant,
  endLeaseByEmployee,
};

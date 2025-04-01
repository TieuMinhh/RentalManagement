import LeaseRepo from "@repository/lease.repo";

import asyncHandler from "@helpers/asyncHandler";
import {
  BadRequestResponse,
  ForbiddenResponse,
  NotFoundResponse,
  SuccessResponse,
} from "@utils/apiResponse";
import RoomRepo from "@repository/room.repo";
import LeaseRequestRepo from "@repository/leaseRequest.repo";
import UserRepo from "@repository/user.repo";
import InvoiceRepo from "@repository/invoice.repo";

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

  // Cập nhật trạng thái yêu cầu thuê trọ
  await LeaseRequestRepo.updateStatus(Number(request_id), "approved");

  // Tạo hợp đồng với trạng thái "pending" (chờ ký)
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

  // Gán hợp đồng cho yêu cầu thuê trọ
  await LeaseRequestRepo.updateLeaseID(Number(request_id), Number(lease.id));

  return new SuccessResponse(
    "Yêu cầu thuê trọ đã được duyệt, chờ người thuê ký",
    { lease }
  ).send(res);
});

const signLease = asyncHandler(async (req, res) => {
  const { lease_id } = req.params;
  const user_id = req.user?.id;

  // Tìm kiếm hợp đồng
  const lease: any = await LeaseRepo.findByID(Number(lease_id));
  if (!lease) {
    return new NotFoundResponse("Hợp đồng không tồn tại").send(res);
  }

  // Kiểm tra quyền của người dùng
  if (lease.tenant?.user_id !== user_id) {
    return new ForbiddenResponse("Bạn không thể ký hợp đồng này").send(res);
  }

  // Kiểm tra trạng thái hợp đồng
  if (lease.status !== "pending") {
    return new BadRequestResponse(
      "Hợp đồng không thể ký ở trạng thái hiện tại"
    ).send(res);
  }

  // Tính tổng tiền cần thanh toán (rent_price - deposit)
  const totalAmount = parseFloat(
    (Number(lease.rent_price) - Number(lease.deposit)).toFixed(2)
  );

  // Cập nhật balance_due trong bảng lease
  await LeaseRepo.updateBalanceDue(lease.id, totalAmount);

  // Tạo hóa đơn
  const invoice = await InvoiceRepo.create({
    lease_id: lease.id,
    invoice_date: new Date(),
    due_date: new Date(new Date().setDate(new Date().getDate() + 7)), // Hạn thanh toán sau 7 ngày
    total_amount: totalAmount,
    payment_status: "pending",
  }).catch((err) => {
    console.error("Lỗi khi tạo hóa đơn:", err);
    return new BadRequestResponse("Lỗi khi tạo hóa đơn").send(res);
  });

  // Cập nhật trạng thái hợp đồng thành "signed"
  await LeaseRepo.updateStatus(Number(lease_id), "signed");

  // Cập nhật role_id của user từ 4 (GUEST) thành 3 (TENANT)
  await UserRepo.updateRole(Number(user_id), 3);

  // Cập nhật trạng thái phòng thành "occupied"
  await RoomRepo.updateStatus(lease.room?.id, "occupied");

  return new SuccessResponse("Hợp đồng đã được ký và hóa đơn đã được tạo", {
    lease_id,
    invoice,
  }).send(res);
});

export {
  getLeases,
  getLeaseByID,
  getLeaseByTenantID,
  approveLeaseRequest,
  signLease,
};

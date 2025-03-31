import LeaseRepo from "@repository/lease.repo";

import asyncHandler from "@helpers/asyncHandler";
import { BadRequestResponse, SuccessResponse } from "@utils/apiResponse";
import RoomRepo from "@repository/room.repo";
import TenantRepo from "@repository/tenant.repo";

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

// export const createLease = asyncHandler(async (req, res) => {
//   const { user_id, room_id, start_date, rent_price, deposit, tenant_info } = req.body;
//   const { id_card, vehicle_plate } = tenant_info;

//   // Kiểm tra phòng có tồn tại và có thể thuê không
//   const room = await RoomRepo.findByID(Number(room_id));
//   if (!room) return new BadRequestResponse("Phòng không tồn tại").send(res);
//   if (room.status !== "available")
//     return new BadRequestResponse("Phòng đã được thuê hoặc đang bảo trì").send(res);

//   const tenant = await TenantRepo.findByUserID(user_id);

//   if (tenant) {
//     // Nếu tenant đã tồn tại, kiểm tra id_card
//     if (tenant.id_card !== id_card) {
//       return new BadRequestResponse("Không thể thay đổi CMND/CCCD").send(res);
//     }

//     // Cho phép cập nhật vehicle_plate nếu cần
//     if (tenant.vehicle_plate !== vehicle_plate) {
//       await TenantRepo.update(tenant.id, { vehicle_plate });
//     }
//   } else {
//     // Nếu tenant chưa tồn tại, tạo mới
//     tenant = await TenantRepo.create({ user_id, id_card, vehicle_plate });
//   }

//   // Tạo hợp đồng thuê mới
//   await LeaseRepo.create({
//     tenant_id: tenant.id,
//     room_id,
//     start_date,
//     rent_price,
//     deposit,
//     status: "active",
//   });

//   // Cập nhật trạng thái phòng thành "occupied"
//   await RoomRepo.update(Number(room_id), { status: "occupied" });

//   return new SuccessResponse("Thuê phòng thành công", {}).send(res);
// });

export { getLeases, getLeaseByID, getLeaseByTenantID };

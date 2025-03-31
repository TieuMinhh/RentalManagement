import LeaseRequest from "@model/LeaseRequest.model";
import Room from "@model/room.model";
import Tenant from "@model/tenant.model";
import User from "@model/user.model";

async function findAll(): Promise<any> {
  return await LeaseRequest.findAll({
    attributes: { exclude: ["room_id", "tenant_id"] },
    include: [
      {
        model: Room,
        as: "room",
        attributes: ["id", "name", "price"],
      },
      {
        model: Tenant,
        as: "tenant",
        attributes: ["id", "user_id", "id_card", "vehicle_plate"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "full_name", "email", "phone"],
          },
        ],
      },
    ],
  });
}

async function findByID(id: number) {
  return await LeaseRequest.findByPk(id, {
    attributes: { exclude: ["room_id", "tenant_id"] },
    include: [
      {
        model: Room,
        as: "room",
        attributes: ["id", "name", "price"],
      },
      {
        model: Tenant,
        as: "tenant",
        attributes: ["id", "user_id", "id_card", "vehicle_plate"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "full_name", "email", "phone"],
          },
        ],
      },
    ],
  });
}

async function findByTenantID(tenant_id: number) {
  return await LeaseRequest.findOne({
    where: { tenant_id },
    attributes: { exclude: ["room_id", "tenant_id"] },
    include: [
      {
        model: Room,
        as: "room",
        attributes: ["id", "name", "price"],
      },
      {
        model: Tenant,
        as: "tenant",
        attributes: ["id", "user_id", "id_card", "vehicle_plate"],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "full_name", "email", "phone"],
          },
        ],
      },
    ],
  });
}

async function findAllPending() {
  return await LeaseRequest.findAll({ where: { status: "pending" } });
}

async function findPendingByTenantId(tenant_id: number) {
  return await LeaseRequest.findOne({
    where: { tenant_id, status: "pending" },
  });
}

async function create(data: any) {
  return await LeaseRequest.create(data);
}

async function updateStatus(
  id: number,
  status: "approved" | "rejected" | "canceled"
) {
  return await LeaseRequest.update({ status }, { where: { id } });
}

export default {
  findAll,
  findByID,
  findByTenantID,
  findAllPending,
  findPendingByTenantId,
  create,
  updateStatus,
};

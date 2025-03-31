import Lease from "@model/lease.model";
import Room from "@model/room.model";
import Tenant from "@model/tenant.model";
import User from "@model/user.model";

async function findAll(): Promise<any> {
  return await Lease.findAll({
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
  return await Lease.findByPk(id, {
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
  return await Lease.findOne({
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

async function create(data: any) {
  return await Lease.create(data);
}

async function update(id: number, data: any) {
  return await Lease.update(data, { where: { id } });
}

export default { findAll, findByID, findByTenantID, create, update };

import Invoice from "@model/invoice.model";
import Lease from "@model/lease.model";
import Room from "@model/room.model";
import Tenant from "@model/tenant.model";
import User from "@model/user.model";

async function findAll(): Promise<any> {
  return await Invoice.findAll({
    attributes: { exclude: ["lease_id"] },
    include: [
      {
        model: Lease,
        as: "lease",
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
            attributes: ["id", "id_card", "vehicle_plate"],
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "full_name", "email", "phone"],
              },
            ],
          },
        ],
      },
    ],
  });
}

export default { findAll };

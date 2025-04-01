import { sequelize } from "@config/sequelize";
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

async function findByID(id: number): Promise<any> {
  return await Invoice.findByPk(id, {
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

async function create(data: any): Promise<any> {
  return await Invoice.create(data);
}

async function update(id: number, data: any): Promise<any> {
  return await Invoice.update(data, {
    where: { id: id },
  });
}

const updatePaidAmount = async (invoiceId: number, amountPaid: number) => {
  // Tìm invoice hiện tại
  const invoice: any = await Invoice.findByPk(invoiceId);
  if (!invoice) return [0];

  const newPaidAmount = (invoice.paid_amount ?? 0) + amountPaid;

  return await Invoice.update(
    { paid_amount: newPaidAmount },
    { where: { id: invoiceId } }
  );
};

export default {
  findAll,
  update,
  findByID,
  create,
  updatePaidAmount,
};

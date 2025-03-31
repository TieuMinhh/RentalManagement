import Tenant from "@model/tenant.model";
import User from "@model/user.model";

async function findAll(): Promise<any> {
  return await Tenant.findAll({
    attributes: { exclude: ["user_id"] },
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });
}

async function findByID(id: number) {
  return await Tenant.findByPk(id, {
    attributes: { exclude: ["user_id"] },
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });
}

async function findByUserID(user_id: number) {
  return await Tenant.findOne({
    where: { user_id },
    attributes: { exclude: ["user_id"] },
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });
}

async function findByIDCard(id_card: string) {
  return await Tenant.findOne({ where: { id_card } });
}

async function create(data: any): Promise<any> {
  return await Tenant.create(data);
}

export default { findAll, findByID, findByUserID, create, findByIDCard };

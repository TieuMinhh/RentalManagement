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

export default { findAll };

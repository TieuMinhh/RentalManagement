import User from "@model/user.model";
import Role from "@model/role.model";
import { Op } from "sequelize";

async function findAll(): Promise<any> {
  return await User.findAll({
    attributes: { exclude: ["role_id"] }, // Loại bỏ 'id' từ User
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["id", "role_name"],
      },
    ],
  });
}

export default { findAll };

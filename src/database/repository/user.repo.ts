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

async function findByID(id: number): Promise<any> {
  return await User.findByPk(id, {
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

async function findOne(data: any): Promise<any> {
  return await User.findOne({ where: data });
}

async function findByEmail(email: string): Promise<any> {
  return await User.findOne({
    where: { email },
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

async function create(data: any): Promise<any> {
  return await User.create(data);
}

async function update(id: number, data: any): Promise<any> {
  return await User.update(data, {
    where: { id: id },
  });
}

async function updateRole(userId: number, newRoleId: number): Promise<any> {
  return await User.update({ role_id: newRoleId }, { where: { id: userId } });
}

export default {
  findAll,
  findByID,
  findOne,
  findByEmail,
  create,
  update,
  updateRole,
};

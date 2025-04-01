import Verification from "@model/verification.model";
import { Op } from "sequelize";

async function create(data: any): Promise<any> {
  return await Verification.create(data);
}

async function findValid(
  token: string,
  type: "reset_password" | "verify_email"
): Promise<any> {
  return await Verification.findOne({
    where: {
      token,
      type,
      expires_at: { [Op.gt]: new Date() }, // Token còn hiệu lực
    },
  });
}

async function deleteToken(
  id_account: number,
  type: "reset_password" | "verify_email"
): Promise<any> {
  return await Verification.destroy({
    where: {
      id_account,
      type,
    },
  });
}

export default {
  create,
  findValid,
  deleteToken,
};

import Role from "@model/role.model";

async function findAll(): Promise<any> {
  return await Role.findAll();
}

async function findOne(data: any): Promise<any> {
  return await Role.findOne({ where: data });
}

async function findByID(id: number): Promise<any> {
  return await Role.findByPk(id);
}

export default { findAll, findByID, findOne };

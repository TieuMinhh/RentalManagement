import RoomType from "@model/roomType.model";

async function findAll(): Promise<any> {
  return await RoomType.findAll();
}

async function findOne(data: any): Promise<any> {
  return await RoomType.findOne({ where: data });
}

async function findByID(id: number): Promise<any> {
  return await RoomType.findByPk(id);
}

export default { findAll, findByID, findOne };

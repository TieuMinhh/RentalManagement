import RoomType from "@model/roomType.model";
import Room from "@model/room.model";

async function findAll(): Promise<any> {
  return await RoomType.findAll();
}

async function findOne(data: any): Promise<any> {
  return await RoomType.findOne({ where: data });
}

async function findByID(id: number): Promise<any> {
  return await RoomType.findByPk(id);
}

async function create(data:any): Promise<any> {
  return await RoomType.create(data);
}

async function update(id:number,data:any): Promise<any> {
  return await RoomType.update(data, {
    where: { id: id },
  });
}

async function checkTypeRoomHaveRoom(data:any): Promise<any> {
  return await Room.findAll({ where: data })
}

async function lock(id:number): Promise<any> {
  return await RoomType.update({ status: "lock" }, { where: { id: id } });
}

async function unLock(id:number): Promise<any> {
  return await RoomType.update({ status: "active" }, { where: { id: id } });
}

export default { findAll, findByID, findOne,create,update,lock,unLock,checkTypeRoomHaveRoom };

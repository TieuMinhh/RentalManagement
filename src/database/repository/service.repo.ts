import Room from "@model/room.model";
import Service from "@model/service.model";

async function findAll(): Promise<any> {
  return await Service.findAll();
}

async function getServiceWithRooms(): Promise<any> {
  return await Service.findAll({
    include: [
      {
        model: Room,
        as: "rooms",
        attributes: ["id", "name", "price", "status"],
      },
    ],
  });
}

async function findOne(data: any): Promise<any> {
  return await Service.findOne({ where: data });
}

async function findByID(id: number): Promise<any> {
  return await Service.findByPk(id);
}

async function create(data: any): Promise<any> {
  return await Service.create(data);
}

async function update(id: number, data: any): Promise<any> {
  return await Service.update(data, {
    where: { id: id },
  });
}

export default {
  findAll,
  findByID,
  findOne,
  getServiceWithRooms,
  create,
  update,
};

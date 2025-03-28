import Room from "@model/room.model";
import RoomService from "@model/roomService.model";
import Service from "@model/service.model";

async function findAll(): Promise<any> {
  return await RoomService.findAll({
    attributes: { exclude: ["room_id", "service_id"] },
    include: [
      {
        model: Room,
        as: "room",
        attributes: ["id", "name", "price"],
      },
      {
        model: Service,
        as: "service",
        attributes: ["id", "service_name", "price"],
      },
    ],
  });
}

async function findOne(data: any): Promise<any> {
  return await RoomService.findOne({ where: data });
}

async function findByID(id: number): Promise<any> {
  return await RoomService.findByPk(id, {
    attributes: { exclude: ["room_id", "service_id"] },
    include: [
      {
        model: Room,
        as: "room",
        attributes: ["id", "name", "price"],
      },
      {
        model: Service,
        as: "service",
        attributes: ["id", "service_name", "price"],
      },
    ],
  });
}

async function create(data: any): Promise<any> {
  return await RoomService.create(data);
}

export default { findAll, findByID, findOne, create };

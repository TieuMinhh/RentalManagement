import Room from "@model/room.model";
import RoomImage from "@model/roomImage.model";
import RoomType from "@model/roomType.model";
import Service from "@model/service.model";

async function findAll(): Promise<any> {
  return await Room.findAll({
    attributes: { exclude: ["room_type_id"] },
    include: [
      {
        model: RoomType,
        as: "roomType",
      },
      {
        model: RoomImage,
        as: "images",
        attributes: ["id", "image_url", "description"],
      },
    ],
  });
}

async function getRoomsWithServices(): Promise<any> {
  return await Room.findAll({
    include: [
      {
        model: Service,
        as: "services",
        through: {
          attributes: ["quantity"],
        },
        attributes: ["id", "service_name", "price"],
      },
    ],
  });
}

async function findOne(data: any): Promise<any> {
  return await Room.findOne({ where: data });
}

async function findByID(id: number): Promise<any> {
  return await Room.findByPk(id, {
    attributes: { exclude: ["room_type_id"] },
    include: [
      {
        model: RoomType,
        as: "roomType",
      },
      {
        model: RoomImage,
        as: "images",
        attributes: ["id", "image_url", "description"],
      },
      {
        model: Service,
        as: "services",
        through: {
          attributes: ["quantity"],
        },
        attributes: ["id", "service_name", "price"],
      },
    ],
  });
}

export default { findAll, findByID, findOne, getRoomsWithServices };

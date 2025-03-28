import Employee from "@model/employee.model";
import MaintenanceRecord from "@model/maintenanceRecords.model";
import Room from "@model/room.model";
import RoomType from "@model/roomType.model";
import User from "@model/user.model";

async function findAll(): Promise<any> {
  return await MaintenanceRecord.findAll({
    attributes: { exclude: ["room_id", "employee_id"] },
    include: [
      {
        attributes: { exclude: ["room_type_id"] },
        model: Room,
        as: "room",
        include: [
          {
            model: RoomType,
            as: "roomType",
          },
        ],
      },
      {
        attributes: { exclude: ["user_id"] },
        model: Employee,
        as: "employee",
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "full_name", "email", "phone"],
          },
        ],
      },
    ],
  });
}

async function findByID(id: number): Promise<any> {
  return await MaintenanceRecord.findByPk(id, {
    attributes: { exclude: ["room_id", "employee_id"] },
    include: [
      {
        attributes: { exclude: ["room_type_id"] },
        model: Room,
        as: "room",
        include: [
          {
            model: RoomType,
            as: "roomType",
          },
        ],
      },
      {
        attributes: { exclude: ["user_id"] },
        model: Employee,
        as: "employee",
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "full_name", "email", "phone"],
          },
        ],
      },
    ],
  });
}

async function create(data: any): Promise<any> {
  return await MaintenanceRecord.create(data);
}

export default { findAll, findByID, create };

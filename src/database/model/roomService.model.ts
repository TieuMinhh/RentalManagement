import { DataTypes } from "sequelize";
import { sequelize } from "@config/sequelize";
import Room from "./room.model";
import Service from "./service.model";

const RoomService = sequelize.define(
  "RoomService",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Room, key: "id" },
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Service, key: "id" },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "room_services",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["room_id", "service_id"],
      },
    ],
  }
);

export default RoomService;

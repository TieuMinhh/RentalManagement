import { DataTypes } from "sequelize";
import { sequelize } from "@config/sequelize";

export interface RoomAttributes {
  id: number;
  name: string;
  room_type_id: number;
  price: number;
  status: "available" | "occupied" | "maintenance";
}

const Room = sequelize.define(
  "Room",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    room_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("available", "occupied", "maintenance"),
      allowNull: false,
      defaultValue:"available"
    },
  },
  {
    tableName: "rooms",
    timestamps: false,
  }
);

export default Room;

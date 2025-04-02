import { DataTypes } from "sequelize";
import { sequelize } from "@config/sequelize";

export interface RoomImageAttributes {
  id: number;
  room_id: number;
  image_url: string;
  description?: string;
}

const RoomImage = sequelize.define(
  "RoomImage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "room_images",
    timestamps: false,
  }
);

export default RoomImage;

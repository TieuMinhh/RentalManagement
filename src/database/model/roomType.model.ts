import { DataTypes } from "sequelize";
import { sequelize } from "@config/sequelize";

export interface RoomTypeAttributes {
  id: number;
  type_name: string;
  description?: string;
}

const RoomType = sequelize.define(
  "RoomType",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "room_types",
    timestamps: false,
  }
);

export default RoomType;

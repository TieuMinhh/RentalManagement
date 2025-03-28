import { DataTypes } from "sequelize";
import { sequelize } from "@config/sequelize";

export interface ServiceAttributes {
  id: number;
  service_name: string;
  price: number;
  status: "active" | "lock";
}

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    service_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "lock"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "services",
    timestamps: false,
  }
);

export default Service;

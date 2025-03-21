import { DataTypes, Model } from "sequelize";
import { sequelize } from "@config/sequelize";
import User from "./user.model";

export interface TenantAttributes {
  id: number;
  user_id: number;
  id_card: string;
  vehicle_plate: string;
}

const Tenant = sequelize.define(
  "Tenant",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    id_card: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    vehicle_plate: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "tenants",
    timestamps: false,
  }
);

export default Tenant;

import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@config/sequelize";

export interface RoleAttributes {
  id: number;
  role_name: string;
}

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    tableName: "roles",
    timestamps: false,
  }
);

export default Role;

import { DataTypes } from "sequelize";
import { sequelize } from "@config/sequelize";
import User from "./user.model";

export interface EmployeeAttributes {
  id: number;
  user_id: number;
  position: string;
  status: "active" | "inactive";
}

const Employee = sequelize.define(
  "Employee",
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
    },
    position: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "employees",
    timestamps: false,
  }
);

export default Employee;

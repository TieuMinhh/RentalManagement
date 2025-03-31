import { DataTypes, Model } from "sequelize";
import { sequelize } from "@config/sequelize";
import Role from "./role.model";

interface UserAttributes {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  role_id: number;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  status: "active" | "lock";
}

const User = sequelize.define<Model<UserAttributes>>(
  "Account",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("active", "lock"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

User.belongsTo(Role, { foreignKey: "role_id", as: "role" });

export default User;

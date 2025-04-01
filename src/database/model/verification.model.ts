import { DataTypes, Model } from "sequelize";
import { sequelize } from "@config/sequelize";
import User from "./user.model";

export interface VerificationAttributes {
  id: number;
  id_account?: number;
  token: string;
  type: "reset_password" | "verify_email";
  expires_at: Date;
}

const Verification = sequelize.define(
  "Verification",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    id_account: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("reset_password", "verify_email"),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "verification",
    timestamps: false,
  }
);

export default Verification;

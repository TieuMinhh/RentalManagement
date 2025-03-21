import { DataTypes } from "sequelize";
import { sequelize } from "@config/sequelize";
import User from "./user.model";
import Lease from "./lease.model";

export interface MailNotificationAttributes {
  id: number;
  user_id: number;
  lease_id?: number | null;
  message: string;
  is_read: boolean;
  created_at?: Date;
}

const MailNotification = sequelize.define(
  "MailNotification",
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
    lease_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Lease,
        key: "id",
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "notifications",
    timestamps: false,
  }
);

export default MailNotification;

import { DataTypes } from "sequelize";
import { sequelize } from "@config/sequelize";
import Lease from "./lease.model";

export interface InvoiceAttributes {
  id: number;
  lease_id: number;
  invoice_date: Date;
  due_date: Date;
  total_amount: number;
  paid_amount?: number;
  payment_status: "pending" | "paid" | "overdue";
}

const Invoice = sequelize.define(
  "Invoice",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lease_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Lease,
        key: "id",
      },
    },
    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paid_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "overdue"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "invoices",
    timestamps: false,
  }
);

export default Invoice;

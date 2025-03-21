import { DataTypes, Model } from "sequelize";
import { sequelize } from "@config/sequelize";
import Invoice from "./invoice.model";

export interface PaymentAttributes {
  id: number;
  invoice_id: number;
  payment_method: string;
  payment_date: Date;
  amount_paid: number;
}

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Invoice,
        key: "id",
      },
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "payments",
    timestamps: false,
  }
);

export default Payment;

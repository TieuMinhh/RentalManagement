import { DataTypes } from "sequelize";
import { sequelize } from "@config/sequelize";
import Room from "./room.model";
import Tenant from "./tenant.model";

export interface LeaseAttributes {
  id: number;
  room_id: number;
  tenant_id: number;
  start_date: Date;
  end_date?: Date;
  rent_price: number;
  deposit: number;
  paid_amount: number;
  balance_due: number;
  status: "pending" | "signed" | "active" | "terminated" | "expired";
}

const Lease = sequelize.define(
  "Lease",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Room,
        key: "id",
      },
    },
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Tenant,
        key: "id",
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rent_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deposit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paid_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "Số tiền đã thanh toán",
    },
    balance_due: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      comment: "Số tiền còn phải thanh toán",
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "signed",
        "active",
        "terminated",
        "expired"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "leases",
    timestamps: false,
  }
);

export default Lease;

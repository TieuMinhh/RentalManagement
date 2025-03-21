import Room from "../model/room.model";
import RoomType from "../model/roomType.model";
import RoomImage from "../model/roomImage.model";
import Service from "@model/service.model";
import RoomService from "@model/roomService.model";
import Employee from "@model/employee.model";
import User from "@model/user.model";
import Tenant from "@model/tenant.model";
import Lease from "@model/lease.model";
import Invoice from "@model/invoice.model";
import Payment from "@model/payment.model";
import MailNotification from "@model/mailNotification.model";

export const initAssociations = () => {
  Room.belongsTo(RoomType, { foreignKey: "room_type_id", as: "roomType" });
  Room.hasMany(RoomImage, { foreignKey: "room_id", as: "images" });

  Room.belongsToMany(Service, {
    through: RoomService,
    foreignKey: "room_id",
    otherKey: "service_id",
    as: "services",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Service.belongsToMany(Room, {
    through: RoomService,
    foreignKey: "service_id",
    otherKey: "room_id",
    as: "rooms",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  RoomService.belongsTo(Room, { foreignKey: "room_id", as: "room" });
  RoomService.belongsTo(Service, { foreignKey: "service_id", as: "service" });

  RoomImage.belongsTo(Room, { foreignKey: "room_id", as: "room" });

  Employee.belongsTo(User, { foreignKey: "user_id", as: "user" });
  User.hasOne(Employee, { foreignKey: "user_id", as: "employee" });

  Tenant.belongsTo(User, { foreignKey: "user_id", as: "user" });
  User.hasOne(Tenant, { foreignKey: "user_id", as: "tenant" });

  Lease.belongsTo(Room, { foreignKey: "room_id", as: "room" });
  Lease.belongsTo(Tenant, { foreignKey: "tenant_id", as: "tenant" });

  Room.hasMany(Lease, { foreignKey: "room_id", as: "leases" });
  Tenant.hasMany(Lease, { foreignKey: "tenant_id", as: "leases" });

  Lease.hasMany(Invoice, { foreignKey: "lease_id", as: "invoices" });
  Invoice.belongsTo(Lease, { foreignKey: "lease_id", as: "lease" });

  Invoice.hasMany(Payment, { foreignKey: "invoice_id", as: "payments" });
  Payment.belongsTo(Invoice, { foreignKey: "invoice_id", as: "invoice" });

  MailNotification.belongsTo(User, { foreignKey: "user_id", as: "user" });
  User.hasMany(MailNotification, {
    foreignKey: "user_id",
    as: "mailNotification",
  });

  MailNotification.belongsTo(Lease, { foreignKey: "lease_id", as: "lease" });
  Lease.hasMany(MailNotification, {
    foreignKey: "lease_id",
    as: "mailNotification",
  });
};

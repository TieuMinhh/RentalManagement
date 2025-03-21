import MailNotification from "@model/mailNotification.model";
import Lease from "@model/lease.model";
import User from "@model/user.model";

async function findAll(): Promise<any> {
  return await MailNotification.findAll({
    attributes: { exclude: ["user_id", "lease_id"] },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "full_name", "email", "phone"],
      },
      {
        model: Lease,
        as: "lease",
        attributes: ["id", "start_date", "end_date"],
      },
    ],
  });
}

export default { findAll };

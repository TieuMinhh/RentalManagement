import Employee from "@model/employee.model";
import User from "@model/user.model";

async function findAll(): Promise<any> {
  return await Employee.findAll({
    attributes: { exclude: ["user_id"] },
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });
}

export default { findAll };

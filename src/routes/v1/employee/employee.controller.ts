import EmployeeRepo from "@repository/employee.repo";

import asyncHandler from "@helpers/asyncHandler";
import { SuccessResponse } from "@utils/apiResponse";

const getEmployees = asyncHandler(async (req, res) => {
  const employees = await EmployeeRepo.findAll();
  return new SuccessResponse("Successful", {
    employees,
  }).send(res);
});

export { getEmployees };

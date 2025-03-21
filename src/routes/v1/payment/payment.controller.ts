import PaymentRepo from "@repository/payment.repo";

import asyncHandler from "@helpers/asyncHandler";
import { SuccessResponse } from "@utils/apiResponse";

const getPayments = asyncHandler(async (req, res) => {
  const payments = await PaymentRepo.findAll();
  return new SuccessResponse("Successful", {
    payments,
  }).send(res);
});

export { getPayments };

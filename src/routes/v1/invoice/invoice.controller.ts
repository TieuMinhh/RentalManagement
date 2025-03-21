import InvoiceRepo from "@repository/invoice.repo";

import asyncHandler from "@helpers/asyncHandler";
import { SuccessResponse } from "@utils/apiResponse";

const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await InvoiceRepo.findAll();
  return new SuccessResponse("Successful", {
    invoices,
  }).send(res);
});

export { getInvoices };

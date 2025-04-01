import InvoiceRepo from "@repository/invoice.repo";

import asyncHandler from "@helpers/asyncHandler";
import { BadRequestResponse, SuccessResponse } from "@utils/apiResponse";

const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await InvoiceRepo.findAll();
  return new SuccessResponse("Successful", {
    invoices,
  }).send(res);
});

const getInvoiceByID = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const invoice = await InvoiceRepo.findByID(Number(id));
  if (!invoice)
    return new BadRequestResponse("Không tìm thấy hoá đơn").send(res);
  return new SuccessResponse("Successful", {
    invoice,
  }).send(res);
});

export { getInvoices, getInvoiceByID };

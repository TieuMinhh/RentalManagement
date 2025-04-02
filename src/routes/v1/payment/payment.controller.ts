import asyncHandler from "@helpers/asyncHandler";
import {
  BadRequestResponse,
  ForbiddenResponse,
  NotFoundResponse,
  SuccessResponse,
} from "@utils/apiResponse";
import LeaseRepo from "@repository/lease.repo";
import InvoiceRepo from "@repository/invoice.repo";
import PaymentRepo from "@repository/payment.repo";
import mail from "@helpers/mail";

const getPayments = asyncHandler(async (req, res) => {
  const payments = await PaymentRepo.findAll();
  return new SuccessResponse("Successful", {
    payments,
  }).send(res);
});

const processPayment = asyncHandler(async (req, res) => {
  const { invoice_id, amount_paid, payment_method } = req.body;
  const user_id = req.user?.id;

  const invoice: any = await InvoiceRepo.findByID(Number(invoice_id));
  if (!invoice) return new NotFoundResponse("Hóa đơn không tồn tại").send(res);

  const lease: any = await LeaseRepo.findByID(invoice.lease?.id);
  if (!lease) return new NotFoundResponse("Hợp đồng không tồn tại").send(res);

  if (lease.tenant?.user_id !== user_id)
    return new ForbiddenResponse("Bạn không thể thanh toán hóa đơn này").send(
      res
    );

  const currentPaidAmount = parseFloat(invoice.paid_amount ?? "0");
  const maxPaymentAllowed = invoice.total_amount - currentPaidAmount;

  if (amount_paid <= 0 || amount_paid > maxPaymentAllowed)
    return new BadRequestResponse(
      `Số tiền thanh toán không hợp lệ. Bạn chỉ có thể thanh toán tối đa ${maxPaymentAllowed.toFixed(
        2
      )}`
    ).send(res);

  const payment = await PaymentRepo.create({
    invoice_id: invoice.id,
    payment_method: payment_method,
    payment_date: new Date(),
    amount_paid: amount_paid,
  });

  const newInvoicePaidAmount = parseFloat(
    (currentPaidAmount + amount_paid).toFixed(2)
  );
  await InvoiceRepo.update(invoice.id, {
    paid_amount: newInvoicePaidAmount, // Cập nhật số tiền đã thanh toán trong hóa đơn
  });

  const currentLeasePaid = parseFloat(lease.paid_amount ?? "0");
  const newPaidAmount = currentLeasePaid + amount_paid; // Tổng số tiền đã thanh toán

  const newBalanceDue = parseFloat(
    (lease.rent_price - lease.deposit - newPaidAmount).toFixed(2)
  );

  await LeaseRepo.update(lease.id, {
    paid_amount: newPaidAmount,
    balance_due: newBalanceDue,
  });

  await mail.sendProcessInvoice(invoice?.lease?.tenant?.user?.email);

  return new SuccessResponse("Thanh toán thành công", {
    payment,
    new_invoice_paid_amount: newInvoicePaidAmount,
    new_lease_paid_amount: newPaidAmount,
    new_balance_due: newBalanceDue,
  }).send(res);
});

export { getPayments, processPayment };

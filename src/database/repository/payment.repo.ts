import Payment from "@model/payment.model";
import Invoice from "@model/invoice.model";

async function findAll(): Promise<any> {
  return await Payment.findAll({
    attributes: { exclude: ["invoice_id"] },
    include: [
      {
        model: Invoice,
        as: "invoice",
      },
    ],
  });
}

export default { findAll };

import cron from "node-cron";
import Lease from "@model/lease.model";
import { Op } from "sequelize";

// Hàm kích hoạt hợp đồng
const activateLeases = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("🔄 Đang kiểm tra hợp đồng có hiệu lực vào ngày:", today);

    const leasesToUpdate = await Lease.findAll({
      where: {
        status: "signed",
        start_date: { [Op.lte]: today },
      },
    });

    if (leasesToUpdate.length > 0) {
      await Lease.update(
        { status: "active" },
        {
          where: {
            status: "signed",
            start_date: { [Op.lte]: today },
          },
        }
      );

      console.log(`✅ Đã kích hoạt ${leasesToUpdate.length} hợp đồng`);
    } else {
      console.log("🔹 Không có hợp đồng nào cần kích hoạt.");
    }
  } catch (error) {
    console.error("❌ Lỗi khi kích hoạt hợp đồng:", error);
  }
};

// Chạy cron job mỗi ngày vào 00:00
cron.schedule("0 0 * * *", activateLeases);

export default activateLeases;

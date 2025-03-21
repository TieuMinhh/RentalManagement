import { sequelize } from "./config/sequelize";

export const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối thành công với MySQL!");

    // Đồng bộ các model với database (có thể thêm { alter: true } để cập nhật bảng)
    await sequelize.sync();
    console.log("✅ Đồng bộ model thành công!");
  } catch (error) {
    console.error("❌ Kết nối thất bại:", error);
    process.exit(1);
  }
};

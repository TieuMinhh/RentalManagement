import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    await transporter.sendMail({
      from: `"Admin" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email gửi thành công tới: ${to}`);
  } catch (error) {
    console.error(`❌ Lỗi khi gửi email tới ${to}:`, error);
  }
};

const mail = {
  async sendVerification(userEmail: string, verification: string) {
    const html = `<p>Mã xác nhận của bạn là: <b>${verification}</b></p>`;
    await sendEmail(userEmail, "Xác nhận tài khoản", html);
  },

  // Gửi thông báo khoá tài khoản
  async sendNotificationBlock(userEmail: string, reason: string) {
    const html = `
      <p>Tài khoản của bạn đã bị khoá với lý do: <b>${reason}</b>.</p>
      <p>Nôn 100k vào Momo 0000000000 để được mở khoá tài khoản.</p>
    `;
    await sendEmail(userEmail, "Thông báo khoá tài khoản", html);
  },

  // Gửi thông báo mở khoá tài khoản
  async sendNotificationUnblock(userEmail: string, reason: string) {
    const html = `
      <p>Tài khoản của bạn đã được mở khoá với lý do: <b>${reason}</b>.</p>
      <p>Bom hàng nữa là bị ban vĩnh viễn luôn.</p>
    `;
    await sendEmail(userEmail, "Thông báo mở khoá tài khoản", html);
  },

  // Gửi thông báo yêu cầu thuê trọ đã được duyệt và yêu cầu ký hợp đồng
  async sendRoomRequestApproved(userEmail: string) {
    const html = `
      <p>Yêu cầu thuê trọ của bạn đã được duyệt!</p>
      <p>Vui lòng ký hợp đồng để bắt đầu chuyển vào ở.</p>
      <p>Chúc bạn một kỳ nghỉ tuyệt vời tại phòng trọ của chúng tôi!</p>
    `;
    await sendEmail(userEmail, "Thông báo duyệt yêu cầu thuê trọ", html);
  },

  // Gửi thông báo đã kỹ hợp đồng thành công và yêu cầu thanh toán hoá đơn
  async sendSignedLease(userEmail: string) {
    const html = `
      <p>Bạn vừa ký hợp đồng thuê trọ thành công!</p>
      <p>Vui lòng thanh toán một phần hoặc toàn bộ phí trong hoá đơn để bắt đầu chuyển vào ở.</p>
      <p>Chúc bạn một kỳ nghỉ tuyệt vời tại phòng trọ của chúng tôi!</p>
    `;
    await sendEmail(userEmail, "Thông báo ký hoá đơn thành công", html);
  },

  // Gửi thông báo kết thúc hợp đồng thuê trọ
  async sendEndLease(userEmail: string) {
    const html = `
      <p>Bạn vừa kết thúc hợp đồng thuê trọ với chúng tôi!</p>
      <p>Hẹn gặp lại bạn trong tương lai!</p>
    `;
    await sendEmail(userEmail, "Thông báo kết thúc hợp đồng thuê trọ", html);
  },

  // Gửi thông báo thanh toán hoá đơn thành công
  async sendProcessInvoice(userEmail: string) {
    const html = `
      <p>Bạn vừa thanh toán hoá đơn thành công!</p>
      <p>Chúc bạn vui vẻ !!!</p>
    `;
    await sendEmail(userEmail, "Thông báo thanh toán hoá đơn thành công", html);
  },

  // Gửi link đặt lại mật khẩu
  async sendResetPassword(userEmail: string, resetLink: string) {
    const html = `
      <div style="
        font-family: Arial, sans-serif;
        color: #333;
        background-color: #f3f4f6;
        padding: 40px 20px;
        border-radius: 12px;
        max-width: 500px;
        margin: 0 auto;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        border: 2px solid #e5e7eb;
      ">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://canhgioi.com/wp-content/uploads/2024/09/anh-tieu-viem-tam-hoa-thien-huyen-bien.jpg" alt="Logo" style="max-width: 120px;">
        </div>
  
        <h2 style="color: #1d4ed8; text-align: center; margin-bottom: 24px;">
          🔐 Đặt lại mật khẩu của bạn
        </h2>
  
        <p style="line-height: 1.6;">
          Xin chào, <br>
          Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. 
          Vui lòng nhấn vào nút bên dưới để tiếp tục:
        </p>
  
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="
               display: inline-block;
               background-color: #1d4ed8;
               color: #ffffff;
               padding: 12px 28px;
               text-decoration: none;
               border-radius: 6px;
               font-weight: bold;
               box-shadow: 0 2px 10px rgba(29, 78, 216, 0.3);
               transition: background-color 0.3s;
             "
             onmouseover="this.style.backgroundColor='#2563eb'"
             onmouseout="this.style.backgroundColor='#1d4ed8'"
          >
            Đặt lại mật khẩu
          </a>
        </div>
  
        <p style="font-size: 14px; color: #6b7280;">
          Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này. 
          Liên kết sẽ hết hạn sau <strong>15 phút</strong>.
        </p>
  
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
  
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Cần trợ giúp? Liên hệ <a href="mailto:support@example.com" style="color: #1d4ed8; text-decoration: none;">support@example.com</a>
        </p>
      </div>
    `;

    await sendEmail(userEmail, "Đặt lại mật khẩu", html);
  },

  // Gửi thông báo cập nhật mật khẩu thành công
  async sendResetPasswordSuccess(userEmail: string) {
    const html = `
      <p>Bạn vừa cập nhật mật khẩu mới thành công</p>
      <p>Chúc bạn kì nghỉ vui vẻ <3</p>
    `;
    await sendEmail(userEmail, "Thông báo cập nhật mật khẩu thành công", html);
  },

  // Tạo mã xác nhận ngẫu nhiên 6 chữ số
  createCode() {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(
      ""
    );
  },
};

export default mail;

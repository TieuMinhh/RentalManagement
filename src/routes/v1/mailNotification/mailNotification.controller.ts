import MailNotification from "@repository/mailNotification.repo";

import asyncHandler from "@helpers/asyncHandler";
import { SuccessResponse } from "@utils/apiResponse";

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await MailNotification.findAll();
  return new SuccessResponse("Successful", {
    notifications,
  }).send(res);
});

export { getNotifications };

import { PaymentStatus } from "~/server/db/validator-schema";

export const formatPaymentStatus = (status: PaymentStatus) => {
  return status === "pending" ? "Chờ xử lý" : status === "paid" ? "Đã thanh toán" : "Đã hoàn tiền";
};

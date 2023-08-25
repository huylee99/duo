import { OrderStatus } from "~/server/db/validator-schema";

export const formatOrderStatus = (status: OrderStatus) => {
  return status === "pending" ? "Đang chờ duyệt" : status === "completed" ? "Đã hoàn thành" : status === "accepted" ? "Đang thực hiện" : "Đã hủy";
};

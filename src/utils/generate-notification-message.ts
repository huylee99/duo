import { type Notification } from "~/server/db/type";

const generateNotificationMessage = (notification: Notification) => {
  switch (notification.type) {
    case "order": {
      if (notification.entityType === 1) {
        return `${notification.sender!.name} đã gửi cho bạn một yêu cầu.`;
      }
    }
    case "rating": {
      return `Bạn vừa nhận được một đánh giá từ ${notification.sender!.name}.`;
    }
  }
};

export default generateNotificationMessage;

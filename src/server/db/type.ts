import { notification } from "./schema";
import { RouterOutputs } from "../utils/api";

export type Notification = RouterOutputs["notification"]["getNotifications"][number];

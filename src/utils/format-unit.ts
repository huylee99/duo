import { type ServiceUnit } from "~/server/db/validator-schema";

export const formatUnit = (unit: ServiceUnit) => {
  return unit === "game" ? "game" : "giờ";
};

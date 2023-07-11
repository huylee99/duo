import * as schema from "./schema";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

const serviceValidatorSchema = createInsertSchema(schema.service, {
  service_name: z.string().min(2).max(191),
  minimum_hour: z.number().int().min(1).max(5),
  service_price: z.number().int().min(5000).max(1000000),
});

export const insertServiceRequestSchema = serviceValidatorSchema.pick({
  minimum_hour: true,
  service_desc: true,
  service_name: true,
  service_price: true,
  unit: true,
  apply_schedule: true,
  start_time: true,
  end_time: true,
});

export const insertServiceFormValidator = insertServiceRequestSchema
  .refine(
    data => {
      if (data.apply_schedule === "custom") {
        return !!data.start_time;
      }
      return true;
    },
    {
      path: ["start_time"],
      message: "Vui lòng chọn giờ bắt đầu",
    }
  )
  .refine(
    data => {
      if (data.apply_schedule === "custom") {
        return !!data.end_time;
      }

      return true;
    },
    {
      path: ["end_time"],
      message: "Vui lòng chọn giờ kết thúc",
    }
  );

export type InsertRequest = z.infer<typeof insertServiceRequestSchema>;

import * as schema from "./schema";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

const serviceValidatorSchema = createInsertSchema(schema.service, {
  service_name: z.string().min(2).max(191),
  minimum_hour: z.number().int().min(1).max(5),
  service_price: z.number().int().min(5000).max(1000000),
  start_time: z.number().int().min(0).max(23),
  end_time: z.number().int().min(0).max(23),
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

export type Order = typeof schema.order.$inferSelect;
export type Service = typeof schema.service.$inferSelect;
export type InsertRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceUnit = Service["unit"];
export type PaymentStatus = Order["payment_status"];
export type OrderStatus = Order["order_status"];

// discounts schema

// const discountValidatorSchema = createInsertSchema(schema.discount, {
//   discount_percent: z.number().int().min(5).max(100),
//   is_active: z.boolean(),
// });

// export const insertDiscountRequestSchema = discountValidatorSchema.pick({
//   discount_percent: true,
//   is_active: true,
//   start_date: true,
//   end_date: true,
//   apply_schedule: true,
// });

// export type InsertDiscountRequest = z.infer<typeof insertDiscountRequestSchema>;

// wallet schema

export const rechargeValidatorRequestSchema = createInsertSchema(schema.transaction, {
  amount: z.number().int().min(10000).max(1000000),
}).pick({
  amount: true,
  payment_method: true,
  type: true,
});

// chat schema

export const chatValidatorRequestSchema = createInsertSchema(schema.message, {
  message: z.string().min(1).max(191),
  recipient_id: z.string().length(24),
  conversation_id: z.string(),
}).pick({
  conversation_id: true,
  message: true,
  recipient_id: true,
});

// order schema

export const orderValidatorSchema = createInsertSchema(schema.order, {
  service_id: z.string().length(24),
  total_amount: z.number().int(),
  user_id: z.string().length(24),
  partner_id: z.string().length(24),
  total_service_requested: z.number().int().min(1),
}).pick({
  service_id: true,
  total_amount: true,
  partner_id: true,
  total_service_requested: true,
});

export const getOrderByIdValidatorSchema = createSelectSchema(schema.order, {
  id: z.string().length(24),
}).pick({ id: true });

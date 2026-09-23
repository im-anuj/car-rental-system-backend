import { z } from "zod";

export const bookingSchema = z.object({
  carName: z.string().min(1, "Car name is required"),

  days: z.number().int().positive().lt(365, "days should be less than 365"),

  rentPerDay: z.number().int().positive().lte(2000, "invalid inputs"),
});

export type bookingInput = z.infer<typeof bookingSchema>;
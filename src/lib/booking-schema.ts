import { z } from "zod";

export const bookingSchema = z.object({
  selected_service: z.string().min(1, "Please select a service"),
  pet_information: z
    .array(
      z.object({
        animal_type: z.string(),
        other_name: z.string().optional(),
        quantity: z.number().min(1),
      })
    )
    .min(1, "Please select at least one pet"),
  selected_dates: z
    .array(
      z.object({
        type: z.enum([
          "30min",
          "60min",
          "house_sitting_start",
          "house_sitting_end",
          "pet_taxi",
        ]),
        datetime: z.string(),
      })
    )
    .min(1, "Please select at least one date and time"),
  address: z.string().optional(),
  starting_point: z.string().optional(),
  ending_point: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  contact_details: z.object({
    name: z.string().min(1, "Name is required"),
    phone_number: z.string().min(1, "Phone number is required"),
    email: z.string().email("Please enter a valid email"),
  }),
  specific_note: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

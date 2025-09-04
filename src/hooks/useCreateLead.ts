import { useMutation } from "@tanstack/react-query"
import type { BookingFormData } from "@/lib/booking-schema"
import { createLead, type CreateLeadResponse } from "@/api/leads"

export function useCreateLead() {
  return useMutation<CreateLeadResponse, Error, BookingFormData>({
    mutationFn: (payload: BookingFormData) => createLead(payload),
  })
}

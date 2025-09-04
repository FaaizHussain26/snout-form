import type { BookingFormData } from "@/lib/booking-schema"

const getBaseUrl = () => {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (!base) {
    console.warn(
      "VITE_API_BASE_URL is not set. Falling back to relative path. Set it in your .env e.g. VITE_API_BASE_URL=https://api.example.com",
    )
  }
  return base ?? ""
}

export type CreateLeadResponse = unknown

export async function createLead(payload: BookingFormData): Promise<CreateLeadResponse> {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/leads`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Failed to create lead (${res.status}): ${text}`)
  }

  const contentType = res.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return (await res.json()) as CreateLeadResponse
  }
  // If backend returns no content or plain text
  return {} as CreateLeadResponse
}

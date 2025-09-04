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

// Lead list types and fetcher
export type Lead = {
  id?: string | number
  name?: string
  email?: string
  phone_number?: string
  address?: string
  specific_note?: string
  pet_information?: {
    animal_type?: string
    other_name?: string
    quantity?: number
  }[]
  selected_dates?: {
    type?: string
    datetime?: string
  }[]
  contact_details?: {
    name?: string
    phone_number?: string
    email?: string
  }
  selected_service?: string
  createdAt?: string
}

export type GetLeadsParams = {
  page?: number
  limit?: number
}

export async function getLeads(params: GetLeadsParams = {}): Promise<Lead[]> {
  const baseUrl = getBaseUrl()
  const url = new URL(`${baseUrl}/leads`, window.location.origin)
  if (params.page) url.searchParams.set("page", String(params.page))
  if (params.limit) url.searchParams.set("limit", String(params.limit))

  const res = await fetch(url.toString(), { method: "GET" })

  
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Failed to fetch leads (${res.status}): ${text}`)
  }
  const data = await res.json().catch(() => [])
  // data can be either {items: []} or [] depending on backend; normalize to array
  const list: Lead[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []

  return list.map((item) => {
    const contact = item.contact_details || {}
    return {
      id: item.id,
      name: item.name ?? contact.name,
      email: item.email ?? contact.email,
      phone_number: item.phone_number ?? contact.phone_number,
      specific_note: item.specific_note,
      pet_information: item.pet_information,
      selected_dates: item.selected_dates,    
      address: item.address,
      selected_service: item.selected_service,
      createdAt: item.createdAt,
    } as Lead
  })
}

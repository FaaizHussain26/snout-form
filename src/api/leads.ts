import type { BookingFormData } from "@/lib/booking-schema";

const getBaseUrl = () => {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!base) {
    console.warn(
      "VITE_API_BASE_URL is not set. Falling back to relative path. Set it in your .env e.g. VITE_API_BASE_URL=https://api.example.com"
    );
  }
  return base ?? "";
};

export type CreateLeadResponse = unknown;

export async function createLead(
  payload: BookingFormData
): Promise<CreateLeadResponse> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/leads`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to create lead (${res.status}): ${text}`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as CreateLeadResponse;
  }
  // If backend returns no content or plain text
  return {} as CreateLeadResponse;
}

// Lead list types and fetcher
export type Lead = {
  id?: string | number;
  name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  starting_point?: string;
  ending_point?: string;
  start_time?: string;
  end_time?: string;
  specific_note?: string;
  pet_information?: {
    animal_type?: string;
    other_name?: string;
    quantity?: number;
  }[];
  selected_dates?: {
    type?: string;
    datetime?: string;
  }[];
  contact_details?: {
    name?: string;
    phone_number?: string;
    email?: string;
  };
  selected_service?: string;
  createdAt?: string;
};

export type GetLeadsParams = {
  page?: number;
  limit?: number;
};

export type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PaginatedLeadsResponse = {
  success: boolean;
  data: Lead[];
  pagination: PaginationInfo;
};

export async function getLeads(
  params: GetLeadsParams = {}
): Promise<PaginatedLeadsResponse> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/leads`, window.location.origin);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));

  const res = await fetch(url.toString(), { method: "GET" });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch leads (${res.status}): ${text}`);
  }

  const response = await res
    .json()
    .catch(() => ({ success: false, data: [], pagination: {} }));

  if (!response.success) {
    throw new Error("Failed to fetch leads");
  }

  // Transform the data to match our Lead type
  const transformedData = response.data.map((item: Record<string, unknown>) => {
    const contact = (item.contact_details as Record<string, unknown>) || {};
    return {
      id: item.id,
      name: (item.name as string) ?? (contact.name as string),
      email: (item.email as string) ?? (contact.email as string),
      phone_number:
        (item.phone_number as string) ?? (contact.phone_number as string),
      specific_note: item.specific_note as string,
      pet_information: item.pet_information as Lead["pet_information"],
      selected_dates: item.selected_dates as Lead["selected_dates"],
      address: item.address as string,
      starting_point: item.starting_point as string,
      ending_point: item.ending_point as string,
      start_time: item.start_time as string,
      end_time: item.end_time as string,
      selected_service: item.selected_service as string,
      createdAt: item.createdAt as string,
    } as Lead;
  });

  return {
    success: response.success,
    data: transformedData,
    pagination: response.pagination,
  };
}

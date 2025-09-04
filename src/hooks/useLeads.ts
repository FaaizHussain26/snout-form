import { useQuery } from "@tanstack/react-query"
import { getLeads, type GetLeadsParams, type Lead } from "@/api/leads"

export function useLeads(params: GetLeadsParams = {}) {
  return useQuery<Lead[], Error>({
    queryKey: ["leads", params],
    queryFn: () => getLeads(params),
  })
}

import { useQuery } from "@tanstack/react-query";
import {
  getLeads,
  type GetLeadsParams,
  type PaginatedLeadsResponse,
} from "@/api/leads";

export function useLeads(params: GetLeadsParams = {}) {
  return useQuery<PaginatedLeadsResponse, Error>({
    queryKey: ["leads", params],
    queryFn: () => getLeads(params),
  });
}

"use client";

import React from "react";
import { useLeads } from "@/hooks/useLeads";
import { usePagination } from "@/hooks/usePagination";
import { PaginationComponent } from "@/components/PaginationComponent";

const Leads = () => {
  const pagination = usePagination({ initialPage: 1, initialLimit: 10 });
  const { data, isLoading, isError, error, refetch, isFetching } = useLeads({
    page: pagination.currentPage,
    limit: pagination.limit,
  });

  // Update pagination info when data changes
  React.useEffect(() => {
    if (data?.pagination) {
      pagination.setPagination(data.pagination);
    }
  }, [data?.pagination, pagination]);

  const handlePageChange = (page: number) => {
    pagination.setCurrentPage(page);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <button
          className="px-4 py-2 rounded-lg bg-pet-brown text-white hover:bg-pet-light-brown disabled:opacity-50 transition-colors font-medium"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading leads...</div>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error?.message || "Failed to load leads"}
        </div>
      )}

      {!!data?.data?.length && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pets
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.data.map((lead, index) => (
                  <tr
                    key={(lead.id as string) ?? index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {lead.name ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          {lead.email ?? "-"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lead.phone_number ?? "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {lead.selected_service
                          ? lead.selected_service
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                          : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {lead.selected_service === "pet_taxi" ? (
                          <div className="space-y-1">
                            <div
                              className="truncate"
                              title={lead.starting_point}
                            >
                              <span className="text-gray-500">From:</span>{" "}
                              {lead.starting_point ?? "-"}
                            </div>
                            <div className="truncate" title={lead.ending_point}>
                              <span className="text-gray-500">To:</span>{" "}
                              {lead.ending_point ?? "-"}
                            </div>
                          </div>
                        ) : lead.selected_service === "house_sitting" ? (
                          <div className="space-y-1">
                            <div className="truncate" title={lead.address}>
                              {lead.address ?? "-"}
                            </div>
                            {(lead.start_time || lead.end_time) && (
                              <div className="text-xs text-gray-500">
                                {lead.start_time && `Start: ${lead.start_time}`}
                                {lead.start_time && lead.end_time && " • "}
                                {lead.end_time && `End: ${lead.end_time}`}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="truncate" title={lead.address}>
                            {lead.address ?? "-"}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-[10px]">
                      <div className="space-y-1">
                        {lead.pet_information?.map((pet, petIndex) => (
                          <div
                            key={petIndex}
                            className="inline-flex items-center gap-2 mr-2 mb-1"
                          >
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                              {pet.animal_type === "other_name"
                                ? pet.other_name.toLocaleUpperCase()
                                : pet.animal_type.toLocaleUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              ×{pet.quantity}
                            </span>
                          </div>
                        )) ?? <span className="text-gray-400">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {lead.selected_dates?.map((dateItem, dateIndex) => {
                          const formatDateTime = (datetime: string) => {
                            const date = new Date(datetime);
                            return {
                              date: date.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }),
                              time: date.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }),
                            };
                          };

                          const formatType = (type: string) => {
                            switch (type) {
                              case "30min":
                                return "30 min visit";
                              case "60min":
                                return "60 min visit";
                              case "house_sitting_start":
                                return "House sitting start";
                              case "house_sitting_end":
                                return "House sitting end";
                              case "pet_taxi":
                                return "Pet taxi";
                              default:
                                return type;
                            }
                          };

                          const { date, time } = dateItem.datetime
                            ? formatDateTime(dateItem.datetime)
                            : { date: "-", time: "" };

                          return (
                            <div key={dateIndex} className="text-sm">
                              <div className="font-medium text-gray-900">
                                {formatType(dateItem.type)}
                              </div>
                              <div className="text-gray-500">
                                {date}
                                {time && (
                                  <span className="ml-1 text-xs text-gray-400">
                                    at {time}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        }) ?? <span className="text-gray-400">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {lead.createdAt
                          ? new Date(lead.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No leads found.</div>
        </div>
      )}

      {/* Pagination Info and Controls */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="mt-6 space-y-4">
          {/* Pagination Info */}
          <div className="flex items-center justify-between text-sm text-gray-700">
            <div>
              Showing{" "}
              {(data.pagination.currentPage - 1) *
                data.pagination.itemsPerPage +
                1}{" "}
              to{" "}
              {Math.min(
                data.pagination.currentPage * data.pagination.itemsPerPage,
                data.pagination.totalItems
              )}{" "}
              of {data.pagination.totalItems} results
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="limit" className="text-sm font-medium">
                Per page:
              </label>
              <select
                id="limit"
                value={pagination.limit}
                onChange={(e) => pagination.setLimit(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pet-brown focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Pagination Component */}
          <PaginationComponent
            pagination={data.pagination}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Leads;

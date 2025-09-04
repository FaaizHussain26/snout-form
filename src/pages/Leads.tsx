"use client"

import { useLeads } from "@/hooks/useLeads"

const Leads = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useLeads()

  console.log(data, "data")

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

      {!!data?.length && (
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
                    Address
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
                {data.map((lead, index) => (
                  <tr key={(lead.id as string) ?? index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{lead.name ?? "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">{lead.email ?? "-"}</div>
                        <div className="text-sm text-gray-500">{lead.phone_number ?? "-"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {lead.selected_service ?? "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={lead.address}>
                        {lead.address ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {lead.pet_information?.map((pet, petIndex) => (
                          <div key={petIndex} className="inline-flex items-center gap-2 mr-2 mb-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                              {pet.animal_type}
                            </span>
                            <span className="text-xs text-gray-500">×{pet.quantity}</span>
                          </div>
                        )) ?? <span className="text-gray-400">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {lead.selected_dates?.map((dateItem, dateIndex) => (
                          <div key={dateIndex} className="text-sm">
                            <div className="font-medium text-gray-900 capitalize">{dateItem.type}</div>
                            <div className="text-gray-500">
                              {dateItem.datetime
                                ? new Date(dateItem.datetime).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "-"}
                            </div>
                          </div>
                        )) ?? <span className="text-gray-400">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {lead.createdAt
                          ? new Date(lead.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
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

      {data && data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No leads found.</div>
        </div>
      )}
    </div>
  )
}

export default Leads

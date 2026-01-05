import { fetchAllRSVPs, calculateStatistics, serializeRSVPs } from '@/lib/rsvpService';
import RSVPTable from '@/components/RSVPTable';
import RefreshButton from '@/components/RefreshButton';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
  const rsvps = await fetchAllRSVPs();
  const statistics = calculateStatistics(rsvps);
  // Serialize RSVPs to make them safe for client components
  const serializedRSVPs = serializeRSVPs(rsvps);

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-cream to-white">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-wedding-burgundy mb-2">
              Wedding RSVP Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage and view all RSVP responses
            </p>
          </div>
          <RefreshButton />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 lg:p-6 border-l-4 border-wedding-gold">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Total RSVPs
                </p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-wedding-burgundy mt-1.5 sm:mt-2">
                  {statistics.totalRSVPs}
                </p>
              </div>
              <div className="bg-wedding-gold bg-opacity-20 rounded-full p-3 sm:p-4 flex-shrink-0 ml-3">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-wedding-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 lg:p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Attending
                </p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mt-1.5 sm:mt-2">
                  {statistics.totalAttending}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3 sm:p-4 flex-shrink-0 ml-3">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 lg:p-6 border-l-4 border-wedding-rose">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Total Guests
                </p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-wedding-rose mt-1.5 sm:mt-2">
                  {statistics.totalGuestCount}
                </p>
              </div>
              <div className="bg-wedding-rose bg-opacity-20 rounded-full p-3 sm:p-4 flex-shrink-0 ml-3">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-wedding-rose"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 lg:p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Tables Assigned
                </p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mt-1.5 sm:mt-2">
                  {statistics.assignedTables}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  of {statistics.totalAttending}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3 sm:p-4 flex-shrink-0 ml-3">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Table */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 lg:p-6">
          <RSVPTable rsvps={serializedRSVPs} />
        </div>
      </div>
    </div>
  );
}


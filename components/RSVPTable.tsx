'use client';

import { useState } from 'react';
import { SerializableRSVP, updateTableNumber } from '@/lib/rsvpService';
import { timestampToDate, formatDateForExcel } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface RSVPTableProps {
  rsvps: SerializableRSVP[];
  onUpdate?: () => void;
}

export default function RSVPTable({ rsvps: initialRsvps, onUpdate }: RSVPTableProps) {
  const [rsvps, setRsvps] = useState<SerializableRSVP[]>(initialRsvps);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tableNumberValue, setTableNumberValue] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleTableNumberClick = (rsvp: SerializableRSVP) => {
    setEditingId(rsvp.id);
    setTableNumberValue(rsvp.tableNumber?.toString() || '');
  };

  const handleTableNumberSave = async (rsvpId: string) => {
    setIsUpdating(rsvpId);
    try {
      const tableNum = tableNumberValue.trim() === '' 
        ? null 
        : parseInt(tableNumberValue, 10);
      
      if (tableNum !== null && (isNaN(tableNum) || tableNum < 1)) {
        alert('Please enter a valid table number (must be 1 or greater)');
        setIsUpdating(null);
        return;
      }

      await updateTableNumber(rsvpId, tableNum);
      
      // Update local state
      setRsvps((prev) =>
        prev.map((rsvp) =>
          rsvp.id === rsvpId
            ? { ...rsvp, tableNumber: tableNum || undefined }
            : rsvp
        )
      );
      
      setEditingId(null);
      setTableNumberValue('');
      
      // Notify parent to refresh if callback provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating table number:', error);
      alert('Failed to update table number. Please try again.');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleTableNumberCancel = () => {
    setEditingId(null);
    setTableNumberValue('');
  };
  const handleExportToExcel = () => {
    // Prepare data for Excel export
    const excelData = rsvps.map((rsvp) => {
      const date = timestampToDate(rsvp.createdAt);
      const createdAtFormatted = formatDateForExcel(date);

      return {
        Name: rsvp.name,
        Email: rsvp.email || '',
        Guests: rsvp.guests,
        Attending: rsvp.attending ? 'Yes' : 'No',
        'Table Number': rsvp.tableNumber || '',
        Message: rsvp.message || '',
        'Created At': createdAtFormatted,
      };
    });

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths for better readability
    const columnWidths = [
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 10 }, // Guests
      { wch: 12 }, // Attending
      { wch: 12 }, // Table Number
      { wch: 40 }, // Message
      { wch: 25 }, // Created At
    ];
    worksheet['!cols'] = columnWidths;
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'RSVPs');

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Create blob and download
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'wedding-rsvp-list.xlsx');
  };

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg sm:text-xl font-semibold text-wedding-burgundy">
          RSVP Responses ({rsvps.length})
        </h3>
        <button
          onClick={handleExportToExcel}
          className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-wedding-gold text-white rounded-lg font-semibold hover:bg-wedding-burgundy transition-colors duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          Export to Excel
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-wedding-cream">
            <tr>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Guests
              </th>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Attending
              </th>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Table No
              </th>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Message
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rsvps.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500 text-base"
                >
                  No RSVPs found
                </td>
              </tr>
            ) : (
              rsvps.map((rsvp) => (
                <tr
                  key={rsvp.id}
                  className="hover:bg-wedding-cream transition-colors duration-150"
                >
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {rsvp.name}
                    </div>
                    {rsvp.email && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {rsvp.email}
                      </div>
                    )}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-700">
                      {rsvp.guests}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        rsvp.attending
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {rsvp.attending ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    {editingId === rsvp.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={tableNumberValue}
                          onChange={(e) => setTableNumberValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleTableNumberSave(rsvp.id);
                            } else if (e.key === 'Escape') {
                              handleTableNumberCancel();
                            }
                          }}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-wedding-gold"
                          autoFocus
                          disabled={isUpdating === rsvp.id}
                        />
                        <button
                          onClick={() => handleTableNumberSave(rsvp.id)}
                          disabled={isUpdating === rsvp.id}
                          className="text-green-600 hover:text-green-700 disabled:opacity-50"
                          title="Save"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={handleTableNumberCancel}
                          disabled={isUpdating === rsvp.id}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                          title="Cancel"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTableNumberClick(rsvp)}
                        disabled={isUpdating === rsvp.id}
                        className={`inline-flex items-center px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                          rsvp.tableNumber
                            ? 'bg-wedding-gold bg-opacity-20 text-wedding-burgundy hover:bg-opacity-30'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } disabled:opacity-50`}
                        title="Click to assign table number"
                      >
                        {rsvp.tableNumber ? (
                          <>Table {rsvp.tableNumber}</>
                        ) : (
                          <>
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                            Assign
                          </>
                        )}
                      </button>
                    )}
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-md">
                      {rsvp.message ? (
                        <p className="line-clamp-2">{rsvp.message}</p>
                      ) : (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {rsvps.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500 text-base">
            No RSVPs found
          </div>
        ) : (
          rsvps.map((rsvp) => (
            <div
              key={rsvp.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-gray-900 truncate">
                    {rsvp.name}
                  </h4>
                  {rsvp.email && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {rsvp.email}
                    </p>
                  )}
                </div>
                <span
                  className={`ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                    rsvp.attending
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {rsvp.attending ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-gray-400"
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
                  <span className="font-medium text-gray-700">
                    {rsvp.guests} {rsvp.guests === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>
                {editingId === rsvp.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={tableNumberValue}
                      onChange={(e) => setTableNumberValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleTableNumberSave(rsvp.id);
                        } else if (e.key === 'Escape') {
                          handleTableNumberCancel();
                        }
                      }}
                      className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-wedding-gold"
                      autoFocus
                      disabled={isUpdating === rsvp.id}
                    />
                    <button
                      onClick={() => handleTableNumberSave(rsvp.id)}
                      disabled={isUpdating === rsvp.id}
                      className="text-green-600 hover:text-green-700 disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleTableNumberCancel}
                      disabled={isUpdating === rsvp.id}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTableNumberClick(rsvp)}
                    disabled={isUpdating === rsvp.id}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      rsvp.tableNumber
                        ? 'bg-wedding-gold bg-opacity-20 text-wedding-burgundy'
                        : 'bg-gray-100 text-gray-600'
                    } disabled:opacity-50`}
                  >
                    {rsvp.tableNumber ? (
                      <>Table {rsvp.tableNumber}</>
                    ) : (
                      <>Assign Table</>
                    )}
                  </button>
                )}
              </div>

              {rsvp.message && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {rsvp.message}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


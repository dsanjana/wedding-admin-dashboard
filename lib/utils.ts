import { Timestamp } from 'firebase/firestore';

/**
 * Safely converts a Firestore Timestamp (or serialized timestamp) to a JavaScript Date
 */
export function timestampToDate(
  timestamp: Timestamp | Date | string | number | { seconds: number; nanoseconds: number } | null | undefined
): Date | null {
  if (!timestamp) return null;
  
  // If it's already a Date
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // If it's a serialized Firestore Timestamp object with seconds and nanoseconds
  if (typeof timestamp === 'object' && 'seconds' in timestamp && 'nanoseconds' in timestamp) {
    const seconds = timestamp.seconds;
    const nanoseconds = timestamp.nanoseconds || 0;
    return new Date(seconds * 1000 + nanoseconds / 1000000);
  }
  
  // If it's a Firestore Timestamp object with toDate method
  if (typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // If it's a string or number, try to parse it
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? null : date;
  }
  
  return null;
}

/**
 * Formats a date for Excel export
 */
export function formatDateForExcel(date: Date | null): string {
  if (!date) return '';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}


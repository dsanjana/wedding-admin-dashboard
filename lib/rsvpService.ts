import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';

export interface RSVP {
  id: string;
  name: string;
  email?: string;
  guests: number;
  attending: boolean;
  message?: string;
  tableNumber?: number;
  createdAt: Timestamp;
}

// Serializable version for client components
export interface SerializableRSVP {
  id: string;
  name: string;
  email?: string;
  guests: number;
  attending: boolean;
  message?: string;
  tableNumber?: number;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  } | string | null;
}

export async function fetchAllRSVPs(): Promise<RSVP[]> {
  try {
    const rsvpsCollection = collection(db, 'rsvps');
    const rsvpsSnapshot = await getDocs(rsvpsCollection);
    
    const rsvps: RSVP[] = [];
    rsvpsSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Map Firestore fields to our expected format
      // Firestore uses: fullName, attendance (string "yes"/"no"), numberOfGuests
      // We expect: name, attending (boolean), guests
      const rsvp: RSVP = {
        id: doc.id,
        name: data.fullName || data.name || '',
        email: data.email || undefined,
        guests: data.numberOfGuests ?? data.guests ?? 0,
        // Convert attendance string ("yes"/"no") to boolean
        attending: typeof data.attendance === 'string' 
          ? data.attendance.toLowerCase() === 'yes'
          : data.attending ?? false,
        message: data.message || undefined,
        tableNumber: data.tableNumber || undefined,
        createdAt: data.createdAt,
      };
      
      rsvps.push(rsvp);
    });
    
    return rsvps;
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    throw error;
  }
}

/**
 * Converts RSVP objects with Firestore Timestamps to serializable format
 * for passing to client components
 */
export function serializeRSVPs(rsvps: RSVP[]): SerializableRSVP[] {
  return rsvps.map((rsvp) => {
    let createdAt: { seconds: number; nanoseconds: number } | string | null = null;
    
    if (rsvp.createdAt) {
      // Handle Firestore Timestamp
      if (rsvp.createdAt instanceof Timestamp) {
        createdAt = {
          seconds: rsvp.createdAt.seconds,
          nanoseconds: rsvp.createdAt.nanoseconds,
        };
      } else if (typeof rsvp.createdAt === 'object' && 'seconds' in rsvp.createdAt && 'nanoseconds' in rsvp.createdAt) {
        // Already in serialized format
        createdAt = rsvp.createdAt as { seconds: number; nanoseconds: number };
      } else if (
        typeof rsvp.createdAt === 'object' &&
        rsvp.createdAt !== null &&
        'toDate' in rsvp.createdAt &&
        typeof (rsvp.createdAt as any).toDate === 'function'
      ) {
        // Timestamp with toDate method
        const date = (rsvp.createdAt as any).toDate();
        createdAt = {
          seconds: Math.floor(date.getTime() / 1000),
          nanoseconds: (date.getTime() % 1000) * 1000000,
        };
      }
    }
    
    return {
      id: rsvp.id,
      name: rsvp.name,
      email: rsvp.email,
      guests: rsvp.guests,
      attending: rsvp.attending,
      message: rsvp.message,
      tableNumber: rsvp.tableNumber,
      createdAt,
    };
  });
}

/**
 * Updates the table number for an RSVP in Firestore
 */
export async function updateTableNumber(rsvpId: string, tableNumber: number | null): Promise<void> {
  try {
    const rsvpRef = doc(db, 'rsvps', rsvpId);
    if (tableNumber === null || tableNumber === undefined) {
      // Remove table number if null
      await updateDoc(rsvpRef, {
        tableNumber: null,
      });
    } else {
      await updateDoc(rsvpRef, {
        tableNumber: tableNumber,
      });
    }
  } catch (error) {
    console.error('Error updating table number:', error);
    throw error;
  }
}

export interface RSVPStatistics {
  totalRSVPs: number;
  totalAttending: number;
  totalGuestCount: number;
  assignedTables: number;
}

export function calculateStatistics(rsvps: RSVP[]): RSVPStatistics {
  const totalRSVPs = rsvps.length;
  const totalAttending = rsvps.filter((rsvp) => rsvp.attending).length;
  const totalGuestCount = rsvps
    .filter((rsvp) => rsvp.attending)
    .reduce((sum, rsvp) => sum + rsvp.guests, 0);
  const assignedTables = rsvps.filter(
    (rsvp) => rsvp.attending && rsvp.tableNumber !== undefined && rsvp.tableNumber !== null
  ).length;
  
  return {
    totalRSVPs,
    totalAttending,
    totalGuestCount,
    assignedTables,
  };
}


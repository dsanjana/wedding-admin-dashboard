# Wedding RSVP Admin Dashboard - Documentation

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Installation & Setup](#installation--setup)
6. [Configuration](#configuration)
7. [Usage Guide](#usage-guide)
8. [Components](#components)
9. [API Reference](#api-reference)
10. [Firestore Data Structure](#firestore-data-structure)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Overview

The Wedding RSVP Admin Dashboard is a Next.js application that provides administrators with a comprehensive interface to manage wedding RSVP responses. It displays statistics, allows table number assignment, and enables exporting RSVP data to Excel.

### Key Capabilities

- View all RSVP responses in a responsive dashboard
- Track statistics (Total RSVPs, Attending count, Guest count, Table assignments)
- Assign table numbers to guests
- Export RSVP data to Excel format
- Mobile-responsive design

---

## Features

### 1. **RSVP Statistics Dashboard**
- **Total RSVPs**: Count of all RSVP submissions
- **Attending**: Number of guests who confirmed attendance
- **Total Guests**: Sum of all guests from attending RSVPs
- **Tables Assigned**: Number of attending guests assigned to tables

### 2. **RSVP Management Table**
- Responsive table view (desktop) and card view (mobile)
- Displays: Name, Email, Guests, Attending status, Table Number, Message
- Real-time updates when table numbers are assigned

### 3. **Table Number Assignment**
- Click-to-edit inline table number assignment
- Validates table numbers (must be positive integers)
- Saves directly to Firestore
- Visual indicators for assigned vs unassigned tables

### 4. **Excel Export**
- Export all RSVP data to `.xlsx` format
- Includes: Name, Email, Guests, Attending, Table Number, Message, Created At
- Formatted dates and proper column widths

### 5. **Mobile Responsive Design**
- Adaptive layout for all screen sizes
- Touch-friendly interface
- Optimized card view for mobile devices

---

## Tech Stack

### Core Technologies
- **Next.js 14** (App Router) - React framework
- **TypeScript** - Type safety
- **React 18** - UI library
- **Tailwind CSS** - Styling

### Backend & Database
- **Firebase Firestore** - NoSQL database
- **Firebase SDK** - Real-time data synchronization

### Libraries
- **XLSX** - Excel file generation
- **file-saver** - File download functionality

---

## Project Structure

```
Invitaion_Dashboard/
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page (redirects to /admin)
│   └── globals.css           # Global styles
├── components/
│   └── RSVPTable.tsx         # RSVP table component with export
├── lib/
│   ├── firebase.ts           # Firebase initialization
│   ├── rsvpService.ts         # RSVP data operations
│   └── utils.ts               # Utility functions
├── .env.local                 # Environment variables (not in git)
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
└── README.md                  # Project overview
```

---

## Installation & Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase project with Firestore enabled

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Firebase

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Firebase configuration:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Copy the web app configuration values

3. Update `.env.local` with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### Step 3: Set Up Firestore

1. In Firebase Console, navigate to **Firestore Database**
2. Create a database (if not already created)
3. Ensure you have a collection named `rsvps`
4. Set up Firestore security rules (for development, you can use test mode)

### Step 4: Run the Application

**Development mode:**
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

**Production build:**
```bash
npm run build
npm start
```

---

## Configuration

### Port Configuration

The application runs on port **3001** by default. To change the port, modify `package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p YOUR_PORT",
    "start": "next start -p YOUR_PORT"
  }
}
```

### Tailwind Configuration

Custom wedding theme colors are defined in `tailwind.config.js`:

```javascript
colors: {
  wedding: {
    gold: '#D4AF37',
    rose: '#E8B4B8',
    cream: '#F5F5DC',
    burgundy: '#800020',
  },
}
```

---

## Usage Guide

### Accessing the Dashboard

1. Navigate to `http://localhost:3001/admin`
2. The dashboard will automatically load all RSVP data from Firestore

### Viewing Statistics

The top section displays four key metrics:
- **Total RSVPs**: All submitted responses
- **Attending**: Confirmed attendees
- **Total Guests**: Total guest count from attending RSVPs
- **Tables Assigned**: Number of guests with assigned table numbers

### Assigning Table Numbers

1. **Desktop View:**
   - Click the "Assign" button or existing table number in the table
   - Enter the table number (must be 1 or greater)
   - Press `Enter` or click the checkmark (✓) to save
   - Press `Escape` or click the X to cancel

2. **Mobile View:**
   - Tap "Assign Table" button in the card
   - Enter table number and save/cancel

### Exporting to Excel

1. Click the **"Export to Excel"** button (top right of the table)
2. The file `wedding-rsvp-list.xlsx` will download automatically
3. Open in Excel or Google Sheets to view the data

---

## Components

### RSVPTable Component

**Location:** `components/RSVPTable.tsx`

**Props:**
```typescript
interface RSVPTableProps {
  rsvps: SerializableRSVP[];
  onUpdate?: () => void; // Optional callback after table number update
}
```

**Features:**
- Displays RSVP data in responsive table/card format
- Inline table number editing
- Excel export functionality
- Real-time state updates

**Usage:**
```tsx
<RSVPTable rsvps={serializedRSVPs} />
```

---

## API Reference

### RSVP Service (`lib/rsvpService.ts`)

#### `fetchAllRSVPs(): Promise<RSVP[]>`

Fetches all RSVP documents from Firestore collection `rsvps`.

**Returns:** Array of RSVP objects

**Example:**
```typescript
const rsvps = await fetchAllRSVPs();
```

#### `serializeRSVPs(rsvps: RSVP[]): SerializableRSVP[]`

Converts RSVP objects with Firestore Timestamps to serializable format for client components.

**Parameters:**
- `rsvps`: Array of RSVP objects with Firestore Timestamps

**Returns:** Array of serializable RSVP objects

#### `updateTableNumber(rsvpId: string, tableNumber: number | null): Promise<void>`

Updates the table number for an RSVP in Firestore.

**Parameters:**
- `rsvpId`: Document ID of the RSVP
- `tableNumber`: Table number to assign (or null to remove)

**Example:**
```typescript
await updateTableNumber('document-id', 5);
```

#### `calculateStatistics(rsvps: RSVP[]): RSVPStatistics`

Calculates statistics from RSVP data.

**Returns:**
```typescript
{
  totalRSVPs: number;
  totalAttending: number;
  totalGuestCount: number;
  assignedTables: number;
}
```

### Utility Functions (`lib/utils.ts`)

#### `timestampToDate(timestamp): Date | null`

Safely converts Firestore Timestamp to JavaScript Date.

**Parameters:**
- `timestamp`: Firestore Timestamp, Date, string, number, or serialized timestamp object

**Returns:** Date object or null

#### `formatDateForExcel(date: Date | null): string`

Formats a date for Excel export.

**Returns:** Formatted date string (e.g., "December 30, 2025, 11:48 PM")

---

## Firestore Data Structure

### Collection: `rsvps`

Each document in the `rsvps` collection should have the following structure:

```typescript
{
  fullName: string;              // Guest's full name
  email?: string;                // Email address (optional)
  attendance: string;             // "yes" or "no"
  numberOfGuests: number;        // Number of guests
  message?: string;              // Optional message
  tableNumber?: number;          // Assigned table number (optional)
  createdAt: Timestamp;          // Firestore timestamp
}
```

### Field Mapping

The application automatically maps Firestore fields to internal format:
- `fullName` → `name`
- `attendance` ("yes"/"no") → `attending` (boolean)
- `numberOfGuests` → `guests`
- `tableNumber` → `tableNumber` (optional)

### Example Document

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "attendance": "yes",
  "numberOfGuests": 2,
  "message": "Looking forward to it!",
  "tableNumber": 5,
  "createdAt": "2025-12-30T18:18:44Z"
}
```

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables on your hosting platform

3. Start the production server:
   ```bash
   npm start
   ```

### Environment Variables for Production

Ensure all `NEXT_PUBLIC_*` variables are set in your hosting platform's environment settings.

---

## Troubleshooting

### Firebase Connection Issues

**Problem:** "Could not reach Cloud Firestore backend"

**Solutions:**
- Verify all environment variables are set correctly
- Check Firebase project settings
- Ensure Firestore is enabled in Firebase Console
- Verify network connection

### TypeScript Build Errors

**Problem:** "Property 'toDate' does not exist on type 'never'"

**Solution:** This has been fixed in the codebase. If you encounter this:
1. Clear `.next` folder: `rm -rf .next`
2. Rebuild: `npm run build`

### Excel Export Not Working

**Problem:** Export button doesn't download file

**Solutions:**
- Check browser console for errors
- Ensure `xlsx` and `file-saver` packages are installed
- Try a different browser
- Check browser's download permissions

### Table Numbers Not Saving

**Problem:** Table number updates don't persist

**Solutions:**
- Check Firestore security rules allow writes
- Verify Firebase credentials are correct
- Check browser console for error messages
- Ensure you have write permissions in Firestore

### Data Not Displaying

**Problem:** Dashboard shows "No RSVPs found"

**Solutions:**
- Verify Firestore collection is named `rsvps`
- Check field names match expected format
- Verify Firestore security rules allow reads
- Check browser console for errors

### Port Already in Use

**Problem:** "Port 3001 is already in use"

**Solutions:**
- Change port in `package.json`
- Kill the process using the port:
  ```bash
  lsof -ti:3001 | xargs kill
  ```

---

## Development

### Running Tests

Currently, no test suite is configured. To add testing:

```bash
npm install --save-dev jest @testing-library/react
```

### Code Style

The project uses ESLint with Next.js configuration. Run linting:

```bash
npm run lint
```

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

---

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Firebase Console for data structure
3. Check browser console for error messages
4. Verify environment variables are set correctly

---

## License

This project is private and proprietary.

---

## Version History

- **v1.0.0** - Initial release
  - RSVP dashboard with statistics
  - Table number assignment
  - Excel export functionality
  - Mobile responsive design

---

**Last Updated:** December 2025




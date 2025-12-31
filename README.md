You are a senior full-stack engineer working on a Next.js (App Router) wedding invitation application that already uses Firebase Firestore.

TASK:
Build an admin-only RSVP dashboard that displays RSVP statistics and allows exporting the RSVP list to Excel.

========================
TECH STACK (MANDATORY)
========================
- Next.js (App Router)
- Firebase Firestore
- Tailwind CSS
- XLSX library for Excel export
- file-saver for downloads

========================
FEATURE REQUIREMENTS
========================

1. Admin Page
- Create a new admin page at route `/admin`
- Page is server-rendered
- Assume admin access is protected by URL secrecy (no auth for now)

2. Fetch RSVP Data
- Read all documents from Firestore collection named `rsvps`
- Each RSVP document contains:
  - name (string)
  - email (string, optional)
  - guests (number)
  - attending (boolean)
  - message (string, optional)
  - createdAt (timestamp)

3. RSVP Statistics (Top Section)
Display the following metrics:
- Total RSVPs (total documents)
- Total “Attending = Yes” count
- Total Guest Count (sum of guests where attending = true)

Display metrics in styled cards using Tailwind CSS.

4. RSVP List Table
- Display RSVP records in a responsive table
- Columns:
  - Name
  - Guests
  - Attending (Yes / No)
  - Message
- Table must be mobile responsive and scrollable

5. Export to Excel
- Add a button labeled “Export to Excel”
- On click:
  - Generate `.xlsx` file
  - Export all RSVP records
  - Columns in Excel:
    - Name
    - Email
    - Guests
    - Attending
    - Message
    - Created At (formatted date)
- File name:
  - `wedding-rsvp-list.xlsx`

6. Code Structure
- Create a Firestore helper function to fetch RSVPs
- Use a client component for Excel export logic
- Keep admin page server-rendered
- Clean, readable, maintainable code

7. UI / Styling
- Use existing wedding UI palette
- Elegant, clean admin layout
- Cards for stats
- Button hover effects
- No unnecessary animations

========================
DELIVERABLES
========================
- `/app/admin/page.tsx`
- `/lib/rsvpService.ts` (Firestore fetch logic)
- `/components/RSVPTable.tsx`
- Instructions to install required libraries

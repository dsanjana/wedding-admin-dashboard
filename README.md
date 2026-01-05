# Wedding RSVP Admin Dashboard

A comprehensive Next.js admin dashboard for managing wedding RSVP responses with table assignment and Excel export capabilities.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
npm run dev
```

Visit `http://localhost:3001/admin` to access the dashboard.

## ✨ Features

- **RSVP Statistics Dashboard** - View total RSVPs, attending count, guest count, and table assignments
- **Table Number Assignment** - Assign table numbers to guests with inline editing
- **Excel Export** - Export all RSVP data to Excel format
- **Mobile Responsive** - Works seamlessly on all devices
- **Real-time Updates** - Changes sync with Firestore immediately

## 📋 Requirements

- Node.js 18+
- Firebase project with Firestore enabled
- Firestore collection named `rsvps`

## 📚 Documentation

For detailed documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Firebase Firestore**
- **Tailwind CSS**
- **XLSX** (Excel export)
- **file-saver** (File downloads)

## 📁 Project Structure

```
├── app/
│   ├── admin/page.tsx      # Admin dashboard
│   └── layout.tsx          # Root layout
├── components/
│   └── RSVPTable.tsx       # RSVP table component
├── lib/
│   ├── firebase.ts         # Firebase config
│   ├── rsvpService.ts     # RSVP operations
│   └── utils.ts            # Utilities
└── package.json
```

## 🔧 Configuration

### Firestore Data Structure

Your Firestore `rsvps` collection should have documents with:
- `fullName` (string) - Guest name
- `email` (string, optional) - Email address
- `attendance` (string) - "yes" or "no"
- `numberOfGuests` (number) - Number of guests
- `message` (string, optional) - Optional message
- `tableNumber` (number, optional) - Assigned table number
- `createdAt` (Timestamp) - Creation timestamp

## 📖 Usage

1. **View Statistics**: Dashboard automatically displays RSVP statistics
2. **Assign Tables**: Click "Assign" button to assign table numbers
3. **Export Data**: Click "Export to Excel" to download RSVP data

## 🐛 Troubleshooting

See [DOCUMENTATION.md](./DOCUMENTATION.md#troubleshooting) for common issues and solutions.

## 📝 License

Private and proprietary.

# Installation Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase project with Firestore enabled

## Step 1: Install Dependencies

Run the following command in the project root:

```bash
npm install
```

This will install all required dependencies:
- Next.js 14
- React 18
- Firebase SDK
- XLSX (for Excel export)
- file-saver (for file downloads)
- Tailwind CSS
- TypeScript

## Step 2: Configure Firebase

1. Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

2. Get your Firebase configuration from the Firebase Console:
   - Go to your Firebase project settings
   - Navigate to "Project settings" > "General" tab
   - Scroll down to "Your apps" section
   - If you don't have a web app, click "Add app" and select the web icon
   - Copy the configuration values

3. Update `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 3: Set Up Firestore

1. In Firebase Console, go to "Firestore Database"
2. Create a database (if not already created)
3. Make sure you have a collection named `rsvps` with documents containing:
   - `name` (string)
   - `email` (string, optional)
   - `guests` (number)
   - `attending` (boolean)
   - `message` (string, optional)
   - `createdAt` (timestamp)

## Step 4: Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Step 5: Access the Admin Dashboard

Navigate to `http://localhost:3000/admin` to view the RSVP dashboard.

## Building for Production

To create a production build:

```bash
npm run build
npm start
```

## Troubleshooting

### Firebase Connection Issues
- Verify all environment variables are set correctly
- Check that your Firebase project has Firestore enabled
- Ensure your Firestore database rules allow read access (for development, you can use test mode)

### Excel Export Not Working
- Make sure `xlsx` and `file-saver` packages are installed
- Check browser console for any errors
- Ensure you're using a modern browser that supports Blob and FileSaver

### Styling Issues
- Verify Tailwind CSS is properly configured
- Run `npm run build` to check for any build errors
- Clear `.next` cache and rebuild if styles aren't loading


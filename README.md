# PNB Event Tracking System

A comprehensive Next.js-based event tracking and link management system for managing multiple events, media campaigns, and tracking click-through rates.

## Features

1. **Event Management**: Create and manage multiple events (e.g., "Chinese New Year Show")
2. **Media Campaigns**: Add multiple media types to each event (e.g., Facebook, Instagram, Email)
3. **Link Routing**: Create trackable links with custom route names for each media campaign
4. **Click Tracking**: Automatic click counting when users access the generated tracking URLs
5. **Manual Adjustments**: Manually increase or decrease click counts with +/- buttons
6. **QR Code Generation**: Generate and download QR codes for any tracking link
7. **Redirect Management**: Configure redirect URLs to third-party ticket purchasing pages
8. **Base URL Configuration**: Set your domain's base URL for generating tracking links
9. **Single-Page Dashboard**: All functionality accessible from one comprehensive dashboard
10. **Hierarchical Statistics**: View click counts aggregated at route, media, and event levels

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **QR Codes**: qrcode library

## Project Structure

```
pnb-event-tracking/
├── app/
│   ├── api/
│   │   ├── config/route.ts      # Base URL configuration
│   │   ├── events/route.ts      # Events CRUD
│   │   ├── media/route.ts       # Media CRUD
│   │   ├── routes/route.ts      # Routes CRUD & click adjustment
│   │   ├── stats/route.ts       # Aggregated statistics
│   │   ├── qr/route.ts          # QR code generation
│   │   └── track/[routeId]/route.ts  # Click tracking & redirect
│   └── page.tsx                 # Main dashboard
├── components/
│   ├── EventCard.tsx            # Event display component
│   ├── MediaItem.tsx            # Media display component
│   ├── RouteItem.tsx            # Route display component
│   └── QRCodeModal.tsx          # QR code viewer/download modal
├── lib/
│   ├── mongodb.ts               # MongoDB connection
│   └── models/
│       ├── Config.ts            # Base URL config model
│       ├── Event.ts             # Event model
│       ├── Media.ts             # Media model
│       └── Route.ts             # Route model with click tracking
└── types/
    └── index.ts                 # TypeScript type definitions
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally, or a MongoDB Atlas account

### Installation

1. Navigate to the project directory:
```bash
cd pnb-event-tracking
```

2. Install dependencies (already done if you followed the creation steps):
```bash
npm install
```

3. Configure MongoDB connection:
   - The default connection string is set to `mongodb://localhost:27017/pnb-event-tracking`
   - To use a different MongoDB instance, update `.env.local`:
```bash
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage Guide

### 1. Set Up Base URL
- Enter your domain's base URL in the "Base URL Configuration" section
- Example: `https://yourdomain.com` or for local testing: `http://localhost:3000`
- Click "Save Base URL"

### 2. Create an Event
- Click "+ Create New Event"
- Enter event name (e.g., "Chinese New Year Show 2025")
- Click "Create Event"

### 3. Add Media to Event
- Click "+ Add Media" on an event card
- Enter media type name (e.g., "Facebook Ads", "Instagram Stories")
- Click "Create Media"

### 4. Add Routes to Media
- Click "+ Add Route" on a media item
- Enter route name (e.g., "facebook ad 1", "instagram story promo")
- Enter the redirect URL (the actual ticket purchasing link from your ticketing provider)
- Click "Create Route"

### 5. Generate QR Codes
- Click the "QR Code" button on any route
- View the QR code in the modal
- Click "Download QR Code" to save as PNG
- Share the QR code on promotional materials

### 6. Track Clicks
- The tracking URL is automatically generated for each route: `{baseUrl}/api/track/{routeId}`
- When someone clicks this link, they're redirected to your ticket URL and the click is counted
- Click counts are visible on each route and aggregated at media and event levels

### 7. Manual Click Adjustments
- Use the + button to increase click count
- Use the - button to decrease click count
- Adjustments affect all aggregated statistics

### 8. View Statistics
- **Route Level**: Individual click count for each route
- **Media Level**: Total clicks across all routes in that media campaign
- **Event Level**: Total clicks across all media campaigns for that event

## How It Works

### Click Tracking Flow
1. User scans QR code or clicks tracking link
2. Request hits `/api/track/[routeId]` endpoint
3. System increments click count in database
4. User is automatically redirected to the configured ticket purchasing URL
5. Dashboard updates to show new click count

### Data Hierarchy
```
Event (e.g., "Chinese New Year Show")
  └── Media (e.g., "Facebook Ads")
      └── Route (e.g., "facebook ad 1")
          ├── Tracking URL: https://yourdomain.com/api/track/abc123
          ├── Redirect URL: https://ticketprovider.com/event/123
          └── Click Count: 42
```

## API Endpoints

- `GET /api/config` - Get base URL configuration
- `POST /api/config` - Update base URL
- `GET /api/events` - List all events
- `POST /api/events` - Create new event
- `DELETE /api/events?id={id}` - Delete event
- `GET /api/media?eventId={id}` - List media for an event
- `POST /api/media` - Create new media
- `DELETE /api/media?id={id}` - Delete media
- `GET /api/routes?mediaId={id}` - List routes for media
- `POST /api/routes` - Create new route
- `DELETE /api/routes?id={id}` - Delete route
- `PATCH /api/routes` - Adjust click count
- `GET /api/stats` - Get aggregated statistics
- `POST /api/qr` - Generate QR code
- `GET /api/track/[routeId]` - Track click and redirect

## Production Deployment

### MongoDB Atlas Setup
1. Create a free MongoDB Atlas account
2. Create a cluster
3. Get your connection string
4. Update `.env.local` with your Atlas connection string

### Deploying to Vercel
1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variable `MONGODB_URI` with your MongoDB connection string
4. Deploy!

### Important: Update Base URL After Deployment
After deploying, update the Base URL in the dashboard to your production domain:
```
https://your-production-domain.vercel.app
```

## License

MIT

## Support

For issues or questions, please create an issue in the project repository.

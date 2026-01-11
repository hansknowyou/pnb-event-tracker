# Quick Start Guide

## Prerequisites Check

Before running the application, ensure MongoDB is installed and running:

```bash
# Check if MongoDB is running (macOS/Linux)
brew services list | grep mongodb
# or
ps aux | grep mongod

# Start MongoDB if not running (macOS with Homebrew)
brew services start mongodb-community

# Or manually start MongoDB
mongod --config /usr/local/etc/mongod.conf
```

## Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **First-time setup:**
   - Set your base URL to `http://localhost:3000` (for local testing)
   - Click "Save Base URL"

## Quick Tutorial

### Create Your First Tracking Link

1. **Create an Event:**
   - Click "+ Create New Event"
   - Enter "Test Event 2025"
   - Click "Create Event"

2. **Add Media:**
   - Click "+ Add Media" on your event
   - Enter "Facebook Ads"
   - Click "Create Media"

3. **Add Route:**
   - Click "+ Add Route" on your media
   - Route name: "test-ad-1"
   - Redirect URL: "https://www.example.com" (replace with your actual ticket URL)
   - Click "Create Route"

4. **Get Your Tracking Link:**
   - Copy the tracking URL shown: `http://localhost:3000/api/track/{routeId}`
   - This is the link you'll share or use in your QR code

5. **Generate QR Code:**
   - Click "QR Code" button
   - Click "Download QR Code"
   - Use this QR code in your promotional materials

6. **Test Click Tracking:**
   - Open the tracking URL in a new tab
   - You'll be redirected to your ticket URL
   - The click count will increment automatically

7. **Manual Adjustments:**
   - Use + or - buttons to manually adjust click counts
   - Useful for offline tracking or corrections

## Example Workflow

### Scenario: Chinese New Year Show with Multiple Campaigns

```
Event: Chinese New Year Show 2025
├── Media: Facebook Ads
│   ├── Route: facebook-carousel-ad → redirects to: https://tickets.com/cny2025
│   ├── Route: facebook-video-ad → redirects to: https://tickets.com/cny2025
│   └── Route: facebook-story-ad → redirects to: https://tickets.com/cny2025
├── Media: Instagram
│   ├── Route: instagram-feed-post → redirects to: https://tickets.com/cny2025
│   └── Route: instagram-story → redirects to: https://tickets.com/cny2025
└── Media: Email Campaign
    └── Route: newsletter-jan-2025 → redirects to: https://tickets.com/cny2025
```

Each route gets:
- A unique tracking URL
- Individual click count
- QR code for printing/sharing
- Redirects to your ticket purchasing page

Click statistics are automatically aggregated:
- **Route level**: Individual ad performance
- **Media level**: Platform performance (e.g., total Instagram clicks)
- **Event level**: Overall event performance (e.g., total clicks for CNY Show)

## Troubleshooting

### MongoDB Connection Error
```
Error: Failed to connect to MongoDB
```
**Solution:** Make sure MongoDB is running. See prerequisites section above.

### Base URL Not Set
If tracking URLs don't work, make sure you've set and saved your base URL in the dashboard.

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill
# Then run npm run dev again
```

## Production Deployment

When deploying to production:

1. **Set up MongoDB Atlas** (free tier available)
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Get connection string

2. **Deploy to Vercel**
   - Push code to GitHub
   - Import in Vercel
   - Add environment variable: `MONGODB_URI=your_atlas_connection_string`

3. **Update Base URL**
   - After deployment, log into your dashboard
   - Update base URL to your production domain
   - Example: `https://your-app.vercel.app`

4. **Generate new QR codes** with production URLs

## Support

Need help? Check the main [README.md](README.md) for detailed documentation.

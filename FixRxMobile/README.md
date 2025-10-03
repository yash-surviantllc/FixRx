# FixRx Mobile App

React Native mobile application for FixRx - Client-Vendor Management Platform

## Features

### Authentication & Onboarding
- **Email Login Flow** - Secure email-based authentication
- **User Type Selection** - Choose between customer or vendor
- **Vendor Profile Setup** - 3-step onboarding process (33%, 67%, 100%)
  - Personal & business information
  - Service area selection with radius
  - Professional credentials (optional)
- **Service Selection** - Choose services to offer
- **Portfolio Upload** - Showcase completed work

### Vendor Side (Complete)
- **Dashboard** - Stats, requests, appointments, and quick actions
- **Notifications** - Real-time notifications with filtering
- **Service Requests** - View, sort, accept/decline requests with detailed view
- **Schedule Management** - Interactive calendar (8 AM - 8 PM) with month navigation
- **Messaging** - Full-featured chat with:
  - Status progress tracking (Quoted → Scheduled → Completed)
  - Quote cards with pricing
  - Appointment scheduling cards
  - Image sharing for before/after photos
  - Service-specific conversations
- **Appointments** - Manage bookings with Upcoming/Completed/Cancelled filters
- **Earnings Tracking** - Revenue, transactions, and payouts
- **Client Management** - Client database with search
- **Referral System** - Invite other service providers
- **Profile Management** - Edit profile, settings, dark mode

### Consumer Side
- **Dashboard** - Browse and book services
- **Search Contractors** - Find service providers
- **Messaging** - Chat with vendors
- **Ratings & Reviews** - Rate completed services

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Expo Go app on your phone (for testing)
- Android Studio (for Android development) or Xcode (for iOS development on Mac)

### Running the App

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Run on your device:**
   - Install **Expo Go** from App Store (iOS) or Play Store (Android)
   - Scan the QR code shown in terminal with:
     - iOS: Camera app
     - Android: Expo Go app

3. **Run on simulator:**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator (Mac only)
   - Press `w` for web browser

## Testing Your App

### On Physical Device
1. Make sure your phone and computer are on the same WiFi network
2. Open Expo Go app
3. Scan the QR code from terminal
4. App will load and hot-reload on changes

### On Emulator/Simulator
- **Android:** Install Android Studio, create an AVD, then press `a` in terminal
- **iOS (Mac only):** Install Xcode, then press `i` in terminal
- **Web:** Press `w` to open in browser (limited functionality)

## Project Structure

```
FixRxMobile/
├── App.tsx                          # Main app entry & navigation
├── src/
│   ├── components/
│   │   └── ui/                      # Reusable UI components
│   ├── context/
│   │   ├── AppContext.tsx           # Global app state
│   │   └── ThemeContext.tsx         # Theme management
│   ├── navigation/
│   │   └── MainTabs.tsx             # Bottom tab navigation
│   ├── screens/
│   │   ├── auth/                    # Authentication screens
│   │   ├── consumer/                # Consumer screens
│   │   └── vendor/                  # Vendor screens ⭐
│   │       ├── VendorDashboard.tsx
│   │       ├── NotificationsScreen.tsx
│   │       ├── ServiceRequestDetailScreen.tsx
│   │       ├── AppointmentsScreen.tsx
│   │       ├── EarningsScreen.tsx
│   │       ├── ClientsScreen.tsx
│   │       ├── ScheduleScreen.tsx
│   │       └── VendorInvitationScreen.tsx
│   └── types/
│       └── navigation.ts            # TypeScript types
├── assets/                          # Images, fonts, etc.
└── package.json                     # Dependencies
```

## Common Commands

```bash
# Start development server
npm start

# Clear cache and restart
npm start -- --clear

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Run on web
npm run web

# Install new dependencies
npm install <package-name>
```

## Development Tips

1. **Hot Reload:** Save files to see changes instantly
2. **Shake device:** Opens developer menu on device
3. **Press `r` in terminal:** Reload the app
4. **Press `j` in terminal:** Open debugger

## Styling

We use a custom style converter that transforms Tailwind-like classes to React Native styles:

```typescript
import { tw } from './src/utils/styleConverter';

// Use Tailwind-like classes
<View style={tw('flex-1 p-4 bg-white')}>
  <Text style={tw('text-lg font-bold text-gray-900')}>
    Hello World
  </Text>
</View>
```

## Next Steps

1. **Test the app** on your device using Expo Go
2. **Migrate more screens** from the web version
3. **Add native features** like push notifications
4. **Build for production** using EAS Build

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)

## Troubleshooting

### App won't load
- Ensure phone and computer are on same network
- Try restarting the Metro bundler: `npm start -- --clear`
- Check firewall settings

### Module not found errors
- Run `npm install`
- Clear cache: `npm start -- --clear`

### Styling issues
- Remember React Native doesn't support all CSS properties
- Use the styleConverter utility for Tailwind classes
- Check Platform-specific code for iOS/Android differences

## Latest Updates (October 2024)

- Added complete vendor dashboard functionality
- Implemented all vendor screens with full navigation
- Added SMS invitation system with referral tracking ($30 per referral)
- Integrated messaging system with context-aware navigation
- Added profile editing with image upload
- Fixed all navigation issues and TypeScript errors
- Removed all debug console.log statements
- Production-ready code

## Vendor Features (Detailed)

### Dashboard
- **Stats Cards**: Today's appointments, new requests, monthly earnings
- **New Requests**: Sortable by newest, distance, priority, or budget
- **Upcoming Appointments**: Quick view with message/call actions
- **Recent Messages**: Unread indicators and quick access
- **Quick Actions**: Navigate to schedule, earnings, clients, settings

### Service Request Management
- **Request Cards**: Customer info, service type, location, budget, priority
- **Sorting Options**: 4-way sorting (newest, distance, priority, budget)
- **Detail View**: Full request details with customer ratings
- **Actions**: Message, call, accept, or decline requests

### Notifications
- **Smart Navigation**: Tapping notification goes to relevant screen
- **Types**: Requests, appointments, messages, payments
- **Unread Tracking**: Visual indicators for unread notifications
- **Mark as Read**: Individual or bulk mark as read

### Schedule Management
- **Interactive Calendar**: Swipe through dates
- **Time Slots**: Dynamic slots per selected date
- **Booking Status**: Available, booked, break indicators
- **Quick Actions**: Block time, view details, add slots

### Appointments
- **Filter Tabs**: Upcoming, completed, cancelled
- **Status Badges**: Color-coded status indicators
- **Quick Actions**: Message, call, view details
- **Customer Info**: Name, service, time, amount

### Earnings
- **Revenue Stats**: Total, monthly, pending, last payout
- **Transaction History**: Detailed transaction list
- **Status Tracking**: Completed, pending, processing
- **Payout Requests**: Request withdrawals

### Client Management
- **Client Database**: All clients with stats
- **Search**: Find clients quickly
- **Client Stats**: Total jobs, spent, last service, rating
- **Quick Actions**: Message, call, view profile

### Referral System
- **Invite Vendors**: Select contacts to invite
- **Referral Bonus**: $50 per successful referral
- **Contact Selection**: Multi-select interface
- **Track Invites**: See invitation status

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **State Management**: Context API (AppContext, ThemeContext)
- **UI Components**: Custom components with Material Icons
- **TypeScript**: Full type safety
- **Styling**: StyleSheet with custom utilities
- **Performance**: React.memo, useCallback, useMemo optimizations

## Performance Optimizations

- **Memoization**: useCallback and useMemo for expensive operations
- **List Rendering**: FlatList with removeClippedSubviews and windowing
- **Component Optimization**: React.memo for preventing unnecessary re-renders
- **Efficient Navigation**: Proper parameter passing and navigation structure
- **Image Optimization**: Lazy loading and proper caching

## Dependencies

Key packages:
- `expo` - Development platform
- `react-navigation` - Navigation library
- `@expo/vector-icons` - Material Icons
- `expo-image-picker` - Image selection
- `react-native-safe-area-context` - Safe area handling
- `@react-native-community/slider` - Range sliders
- `react-native-toast-message` - Toast notifications

## Production Ready

All vendor features are:
- Fully functional
- TypeScript typed
- Responsive design
- Error handling
- Professional UI/UX
- Production-ready code

## License

Private - FixRx Platform

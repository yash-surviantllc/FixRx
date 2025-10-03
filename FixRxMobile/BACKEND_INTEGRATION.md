# Backend Integration Guide

This document explains how the FixRx mobile app is structured for seamless backend integration.

## 🏗️ Architecture Overview

The frontend is designed with a clean separation between UI components and data management, making it easy to switch from mock data to real backend APIs.

### Key Components

1. **API Service Layer** (`src/services/apiService.ts`)
2. **WebSocket Service** (`src/services/websocketService.ts`) 
3. **Type Definitions** (`src/types/api.ts`)
4. **Centralized State Management** (`src/context/AppContext.tsx`)
5. **Configuration** (`src/config/backend.ts`)

## 🔧 Quick Setup for Backend Integration

### 1. Environment Configuration

Create a `.env` file in the project root:

```env
# API Configuration
EXPO_PUBLIC_API_URL=https://your-api-domain.com/api
EXPO_PUBLIC_WS_URL=wss://your-api-domain.com

# Feature Flags
EXPO_PUBLIC_USE_REAL_BACKEND=true
```

### 2. Enable Real Backend

In `src/config/backend.ts`, set:
```typescript
useRealBackend: true
```

### 3. Implement API Endpoints

In `src/services/apiService.ts`, uncomment and implement the real API calls:

```typescript
// Replace mock responses with real API calls
private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const response = await fetch(`${this.baseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
      ...options.headers,
    },
  });
  
  return await response.json();
}
```

## 📡 Real-Time Features

### WebSocket Integration

The app includes a complete WebSocket service for real-time updates:

- **Messages**: Live chat updates
- **Service Requests**: Status changes, new requests
- **Appointments**: Schedule updates
- **Notifications**: Push notifications

### Event Handling

```typescript
// In AppContext.tsx, these handlers are already set up:
const handleNewMessage = (message) => {
  // Updates conversation list automatically
};

const handleRequestUpdate = (request) => {
  // Updates service request status
};
```

## 🔄 Data Flow Architecture

### Current State (Mock Data)
```
UI Components → AppContext (Mock Data) → Display
```

### Backend-Ready State
```
UI Components → AppContext → API Service → Backend APIs
                ↓
            WebSocket ← Real-time Updates
```

## 📊 Supported Features

### ✅ Ready for Backend Integration

1. **Authentication**
   - Login/Register
   - Token management
   - User profiles

2. **Service Requests**
   - Create, read, update
   - Real-time status updates
   - Photo uploads
   - Filtering and sorting

3. **Conversations & Messages**
   - Real-time messaging
   - Message history
   - Read receipts
   - Typing indicators

4. **Appointments**
   - Scheduling
   - Status updates
   - Reminders

5. **Clients Management**
   - Client profiles
   - Service history
   - Notes and ratings

6. **Notifications**
   - Push notifications
   - In-app notifications
   - Real-time alerts

## 🛠️ Implementation Steps

### Phase 1: Basic API Integration
1. Set up authentication endpoints
2. Implement service request CRUD operations
3. Connect conversation/messaging APIs

### Phase 2: Real-Time Features
1. Set up WebSocket server
2. Implement real-time message delivery
3. Add live status updates

### Phase 3: Advanced Features
1. Push notifications
2. File upload handling
3. Offline synchronization

## 📋 API Endpoints Required

### Authentication
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `POST /auth/refresh`

### Service Requests
- `GET /service-requests` (with filtering)
- `GET /service-requests/:id`
- `POST /service-requests`
- `PUT /service-requests/:id`

### Conversations
- `GET /conversations`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages`
- `POST /conversations/:id/read`

### Appointments
- `GET /appointments`
- `POST /appointments`
- `PUT /appointments/:id`

### File Upload
- `POST /upload`

## 🔌 WebSocket Events

### Client → Server
- `join:room` - Join conversation room
- `typing:start` - User started typing
- `typing:stop` - User stopped typing

### Server → Client
- `message:new` - New message received
- `request:updated` - Service request status changed
- `appointment:updated` - Appointment modified
- `notification:new` - New notification

## 🎯 Testing Backend Integration

### 1. Mock Mode (Current)
```typescript
// In backend.ts
useRealBackend: false
```

### 2. Development Mode
```typescript
// In backend.ts
useRealBackend: true
api.baseUrl: 'http://localhost:3000/api'
```

### 3. Production Mode
```typescript
// In backend.ts
useRealBackend: true
api.baseUrl: 'https://api.fixrx.com/api'
```

## 🚀 Deployment Considerations

1. **Environment Variables**: Set up proper environment variables for different stages
2. **Error Handling**: Implement proper error boundaries and fallbacks
3. **Offline Support**: The app gracefully handles offline scenarios
4. **Performance**: API calls are optimized with caching and pagination
5. **Security**: Token-based authentication with automatic refresh

## 📱 Current Features Working with Mock Data

- ✅ Service request management with sorting/filtering
- ✅ Real-time conversation updates (simulated)
- ✅ Appointment scheduling
- ✅ Message threading
- ✅ Photo handling
- ✅ Navigation between all screens
- ✅ Consistent data flow across components

## 🔄 Migration Path

The app is designed for **zero-downtime migration**:

1. **Phase 1**: Keep mock data, add API service layer
2. **Phase 2**: Gradually replace mock calls with real APIs
3. **Phase 3**: Enable real-time features
4. **Phase 4**: Full backend integration

All UI components will continue working without changes during the migration process.

---

**Ready for Backend Integration!** 🎉

The frontend architecture is completely prepared for backend integration. Simply implement the API endpoints according to the defined interfaces, and the app will seamlessly transition from mock data to real backend data.

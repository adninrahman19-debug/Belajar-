
import React from 'react';
import { Device, DeviceStatus, TechnicalBlueprint } from './types';

export const MOCK_DEVICES: Device[] = [
  {
    id: 'd1',
    name: 'iPhone 15 Pro',
    type: 'phone',
    status: DeviceStatus.ONLINE,
    lastSeen: new Date().toISOString(),
    battery: 84,
    location: { lat: 37.7749, lng: -122.4194, address: 'Market St, San Francisco, CA' }
  },
  {
    id: 'd2',
    name: 'MacBook Pro 16"',
    type: 'laptop',
    status: DeviceStatus.STATIONARY,
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    battery: 45,
    location: { lat: 37.7833, lng: -122.4167, address: 'Union Square, San Francisco, CA' }
  },
  {
    id: 'd3',
    name: 'iPad Air',
    type: 'tablet',
    status: DeviceStatus.OFFLINE,
    lastSeen: new Date(Date.now() - 86400000).toISOString(),
    battery: 12,
    location: { lat: 37.7510, lng: -122.4476, address: 'Twin Peaks, San Francisco, CA' }
  }
];

export const TECHNICAL_BLUEPRINTS: TechnicalBlueprint[] = [
  {
    title: "Database Schema (SQL/Prisma)",
    language: "typescript",
    description: "Robust schema for tracking devices, users, and historical coordinates.",
    code: `
// schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashed
  devices   Device[]
  createdAt DateTime @default(now())
}

model Device {
  id           String     @id @default(uuid())
  name         String
  ownerId      String
  owner        User       @relation(fields: [ownerId], references: [id])
  token        String     @unique // Device identification token
  lastLat      Float?
  lastLng      Float?
  lastSeen     DateTime?
  batteryLevel Int?
  history      Location[]
}

model Location {
  id        String   @id @default(uuid())
  deviceId  String
  device    Device   @relation(fields: [deviceId], references: [id])
  lat       Float
  lng       Float
  timestamp DateTime @default(now())
}
    `
  },
  {
    title: "Backend Auth & Tracking (Express)",
    language: "typescript",
    description: "JWT implementation and Geolocation link simulation logic.",
    code: `
// auth.service.ts
import jwt from 'jsonwebtoken';

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// tracking.controller.ts
// Simulation of SMS tracking flow
export const initiateSmsTracking = async (req, res) => {
  const { phoneNumber, deviceId } = req.body;
  const trackingLink = \`https://geoguard.app/consent?d=\${deviceId}\`;
  
  // In real implementation, use Twilio or similar
  await sendSms(phoneNumber, \`GeoGuard: To locate your device, please click: \${trackingLink}\`);
  
  res.json({ message: 'Tracking link sent successfully' });
};

// Geolocation Consent Endpoint (Client Side Logic)
// navigator.geolocation.getCurrentPosition((pos) => {
//   sendCoordsToBackend(pos.coords.latitude, pos.coords.longitude);
// });
    `
  },
  {
    title: "Legal Compliance (GDPR/CCPA)",
    language: "markdown",
    description: "Privacy requirements for real-time tracking.",
    code: `
### GDPR/CCPA Requirements for Location Tracking
1. **Explicit Consent**: Users must opt-in specifically to GPS data collection.
2. **Purpose Limitation**: You must state exactly why you are tracking (e.g., "Finding lost devices").
3. **Data Minimization**: Only collect what is necessary (don't store location every 1s if not needed).
4. **Right to Erasure**: Users must be able to delete their location history permanently.
5. **Data Residency**: If tracking EU citizens, store data in GDPR-compliant regions.
6. **Notification**: Users should receive periodic reminders that tracking is active.
    `
  }
];

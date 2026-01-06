
import { Device, DeviceStatus, TechnicalBlueprint } from '../types';

export const MOCK_DEVICES: Device[] = [
  {
    id: 'd1',
    name: 'iPhone 15 Pro',
    type: 'phone',
    status: DeviceStatus.ONLINE,
    lastSeen: new Date().toISOString(),
    battery: 84,
    location: { lat: -6.2000, lng: 106.8166, address: 'Sudirman, Jakarta' }
  }
];

export const TECHNICAL_BLUEPRINTS: TechnicalBlueprint[] = [
  {
    title: "Database Schema (SQL/Prisma)",
    language: "typescript",
    description: "Robust schema for tracking devices, users, and historical coordinates.",
    code: `
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  devices   Device[]
  createdAt DateTime @default(now())
}

model Location {
  id        String   @id @default(uuid())
  deviceId  String
  lat       Float
  lng       Float
  timestamp DateTime @default(now())
}`
  },
  {
    title: "Backend Auth (Express)",
    language: "typescript",
    description: "JWT implementation for secure shadow operator access.",
    code: `
export const initiateSmsTracking = async (req, res) => {
  const { phoneNumber, deviceId } = req.body;
  const link = \`https://shdw.os/access?id=\${deviceId}\`;
  await sendSms(phoneNumber, \`System Alert: Verify location at \${link}\`);
  res.json({ status: 'PAYLOAD_SENT' });
};`
  }
];

import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

// ડેટાબેઝમાં એડમિન ન હોય તો .env ની વિગતોથી પહેલો એડમિન બનાવે છે.
export default async function seedAdmin() {
  if (await User.findOne({ role: 'admin' })) return;
  await User.create({
    name: 'APMC Admin',
    phone: process.env.ADMIN_PHONE,
    role: 'admin',
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
  });
}

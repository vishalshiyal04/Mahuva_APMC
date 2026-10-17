import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

await mongoose.connect(process.env.MONGO_URI);
const r = await mongoose.connection.collection('users').updateOne(
  { role: 'admin' },
  { $set: { phone: process.env.ADMIN_PHONE, password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10) } }
);
console.log(r.matchedCount ? 'એડમિન અપડેટ થયો' : 'એડમિન મળ્યો નહીં, પહેલા npm start ચલાવો');
process.exit();

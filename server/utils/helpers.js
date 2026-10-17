import jwt from 'jsonwebtoken';

export const subActive = u => u.subscriptionUntil && u.subscriptionUntil > new Date();

// ---- Commission agent SaaS ----
export const licOk = u => u.licenseUntil && u.licenseUntil > new Date();

export const sign = u => ({ token: jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: { id: u._id, name: u.name, role: u.role, subscriptionUntil: u.subscriptionUntil, subRequest: u.subRequest } });

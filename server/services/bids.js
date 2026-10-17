import { User, Bid } from '../models/index.js';

// ---- બોલી પેનલ / પાસ / રદ ----
export async function bidInfo(cropId) {
  const rows = await Bid.find({ crop: cropId }).sort({ createdAt: -1 }).populate('trader', 'name').lean();
  const eligible = await User.countDocuments({ role: 'trader', subscriptionUntil: { $gt: new Date() } });
  const bids = rows.filter(b => b.type === 'bid').map(b => ({ name: b.trader?.name, amount: b.amount, at: b.createdAt }));
  const bidders = new Set(rows.filter(b => b.type === 'bid').map(b => String(b.trader?._id)));
  const passes = rows.filter(b => b.type === 'pass' && !bidders.has(String(b.trader?._id))).map(b => b.trader?.name);
  const responded = new Set(rows.map(b => String(b.trader?._id))).size;
  return { eligible, bids, passes, responded };
}

import { Router } from 'express';
import { Crop, Bid } from '../models/index.js';
import Settings from '../config/settings.js';
import auth from '../middleware/auth.js';
import wrap from '../middleware/wrap.js';
import { subActive } from '../utils/helpers.js';
import { io } from '../socket.js';

const router = Router();

router.post('/trader/subscribe', auth('trader'), wrap(async (req, res) => {
  req.user.subRequest = 'requested'; await req.user.save();
  res.json({ msg: `₹${Settings.traderMonthlyFee} ચૂકવી એડમિનની મંજૂરીની રાહ જુઓ` });
}));

router.get('/trader/auctions', auth('trader'), wrap(async (req, res) => {
  if (!subActive(req.user)) throw new Error('સબ્સ્ક્રિપ્શન સક્રિય નથી');
  const crops = await Crop.find({ status: 'auction' }).lean();
  const mine = await Bid.find({ trader: req.user._id, crop: { $in: crops.map(c => c._id) } }).lean();
  res.json(crops.map(c => ({ ...c, passed: mine.some(b => String(b.crop) === String(c._id) && b.type === 'pass'),
    leading: String(c.highestBidder) === String(req.user._id) })));
}));

router.post('/trader/bid/:id', auth('trader'), wrap(async (req, res) => {
  if (!subActive(req.user)) throw new Error('સબ્સ્ક્રિપ્શન સક્રિય નથી');
  const c = await Crop.findOneAndUpdate({ _id: req.params.id, status: 'auction', highestBid: { $lt: +req.body.amount } },
    { highestBid: +req.body.amount, highestBidder: req.user._id }, { new: true });
  if (!c) throw new Error('બોલી વર્તમાન ભાવ કરતાં વધુ હોવી જોઈએ');
  await Bid.deleteOne({ crop: c._id, trader: req.user._id, type: 'pass' });
  await Bid.create({ crop: c._id, trader: req.user._id, amount: c.highestBid });
  io.emit('auction:update', c); res.json({ msg: 'બોલી લાગી ગઈ' });
}));

router.post('/trader/pass/:id', auth('trader'), wrap(async (req, res) => {
  if (!subActive(req.user)) throw new Error('સબ્સ્ક્રિપ્શન સક્રિય નથી');
  const c = await Crop.findOne({ _id: req.params.id, status: 'auction' });
  if (!c) throw new Error('હરાજી ચાલુ નથી');
  if (String(c.highestBidder) === String(req.user._id)) throw new Error('તમારી બોલી હાલ સૌથી ઊંચી છે');
  await Bid.updateOne({ crop: c._id, trader: req.user._id, type: 'pass' }, { $setOnInsert: { amount: 0 } }, { upsert: true });
  io.emit('auction:update', c); res.json({ msg: 'નોંધાયું: તમે આ હરાજીમાં બોલી નહીં લગાવો' });
}));

export default router;

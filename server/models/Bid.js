import mongoose from 'mongoose';

const S = mongoose.Schema;

export default mongoose.model('Bid', new S({ crop: S.Types.ObjectId, trader: { type: S.Types.ObjectId, ref: 'User' },
  type: { type: String, default: 'bid' }, amount: { type: Number, default: 0 } }, { timestamps: true }));

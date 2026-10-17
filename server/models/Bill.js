import mongoose from 'mongoose';

const S = mongoose.Schema;

export default mongoose.model('Bill', new S({ agent: S.Types.ObjectId, party: String, cropName: String, man: Number, rate: Number,
  commissionPct: Number, gross: Number, commission: Number, net: Number }, { timestamps: true }));

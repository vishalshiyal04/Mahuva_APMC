import mongoose from 'mongoose';

const S = mongoose.Schema;

export default mongoose.model('Payment', new S({ paymentId: { type: String, unique: true }, user: S.Types.ObjectId, amount: Number }, { timestamps: true }));

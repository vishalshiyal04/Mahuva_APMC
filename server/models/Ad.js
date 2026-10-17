import mongoose from 'mongoose';

const S = mongoose.Schema;

export default mongoose.model('Ad', new S({ title: String, company: String, text: String, active: { type: Boolean, default: true } }));

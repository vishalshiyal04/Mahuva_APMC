import mongoose from "mongoose";

const S = mongoose.Schema;

export default mongoose.model(
  "PriceAlert",
  new S(
    {
      user: {
        type: S.Types.ObjectId,
        ref: "User",
        index: true,
        required: true,
      },
      crop: { type: String, required: true }, // સામાન્ય નામ, જેમ કે "લાલ ડુંગળી" / "મગફળી 24"
      direction: { type: String, enum: ["above", "below"], required: true },
      target: { type: Number, required: true, min: 1, max: 1e7 }, // ₹ પ્રતિ મણ
      active: { type: Boolean, default: true },
      triggeredAt: Date,
      triggeredPrice: Number,
      triggeredDate: String,
    },
    { timestamps: true },
  ),
);

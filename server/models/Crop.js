import mongoose from "mongoose";

const S = mongoose.Schema;

export default mongoose.model(
  "Crop",
  new S(
    {
      farmer: { type: S.Types.ObjectId, ref: "User" },
      name: String,
      grade: String,
      man: Number,
      basePrice: Number,
      shed: String,
      passId: String,
      photo: String,
      enteredAt: Date,
      status: { type: String, default: "pending" },
      highestBid: { type: Number, default: 0 },
      highestBidder: { type: S.Types.ObjectId, ref: "User" },
    },
    { timestamps: true },
  ),
);

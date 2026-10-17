import mongoose from "mongoose";

const S = mongoose.Schema;

const paymentSchema = new S({
  key: {
    type: String,
    required: true,
  },
  side: {
    type: String,
    enum: ["trader", "farmer"],
    required: true,
  },
  amountPaise: {
    type: Number,
    required: true,
    min: 0,
    validate: Number.isSafeInteger,
  },
  historyComplete: {
    type: Boolean,
    default: false,
  },
  kind: {
    type: String,
    enum: ["payment", "verification"],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    enum: ["cash", "upi", "bank"],
    required: true,
  },
  reference: {
    type: String,
    maxlength: 100,
    default: "",
  },
  note: {
    type: String,
    maxlength: 300,
    default: "",
  },
  recordedBy: {
    type: S.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model(
  "Patti",
  new S(
    {
      crop: {
        type: S.Types.ObjectId,
        ref: "Crop",
      },
      farmer: {
        type: S.Types.ObjectId,
        ref: "User",
      },
      trader: {
        type: S.Types.ObjectId,
        ref: "User",
      },
      cropName: String,
      man: Number,
      rate: Number,
      gross: Number,
      commission: Number,
      farmerNet: Number,

      traderPaymentTracked: {
        type: Boolean,
        default: true,
      },
      farmerPaymentTracked: {
        type: Boolean,
        default: true,
      },
      payments: {
        type: [paymentSchema],
        default: [],
      },
    },
    { timestamps: true },
  ),
);

import mongoose from "mongoose";

const S = mongoose.Schema;

export default mongoose.model(
  "User",
  new S(
    {
      name: String,
      phone: { type: String, unique: true },
      password: String,
      role: { type: String, enum: ["farmer", "trader", "admin", "agent"] },
      gst: String,
      license: String,
      blocked: { type: Boolean, default: false }, // નવું: એડમિન બ્લોક કરી શકે
      shopName: String,
      licenseUntil: Date,
      subscriptionUntil: Date,
      subRequest: { type: String, default: "none" },
    },
    { timestamps: true },
  ),
);

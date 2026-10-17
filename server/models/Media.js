import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    type: { type: String, enum: ["photo", "video"] },
    title: String,
    url: String,
  },
  { timestamps: true },
);

export default mongoose.models.Media || mongoose.model("Media", schema);

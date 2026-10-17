import mongoose from "mongoose";

const schema = new mongoose.Schema(
  { slug: { type: String, unique: true }, title: String, body: String },
  { timestamps: true },
);

export default mongoose.models.Page || mongoose.model("Page", schema);

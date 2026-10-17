import mongoose from "mongoose";

const schema = new mongoose.Schema(
  { title: String, body: String },
  { timestamps: true },
);

export default mongoose.models.News || mongoose.model("News", schema);

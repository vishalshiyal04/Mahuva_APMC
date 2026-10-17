import mongoose from "mongoose";

export default mongoose.model(
  "Rate",
  new mongoose.Schema(
    {
      crop: String,
      min: Number,
      max: Number,
      avg: Number,
      date: String,

      // ઉદાહરણ: "મણ (20 કિલો)", "ક્વિન્ટલ", "નંગ"
      unitLabel: String,

      // વજન આધારિત એકમ હોય ત્યારે જ આપવું.
      // મણ = 20, ક્વિન્ટલ = 100, પ્રતિ નંગ = ખાલી.
      unitKg: Number,
    },
    { timestamps: true },
  ),
);

import mongoose from "mongoose";

const S = mongoose.Schema;

// ઇન-એપ સૂચના (ઘંટડી). 90 દિવસ પછી આપોઆપ કાઢી નંખાય.
export default mongoose.model(
  "Notification",
  new S(
    {
      user: {
        type: S.Types.ObjectId,
        ref: "User",
        index: true,
        required: true,
      },
      type: { type: String, default: "info" }, // auction | outbid | patti | payment | subscription | alert | gate | info
      title: { type: String, required: true, maxlength: 140 },
      body: { type: String, maxlength: 400, default: "" },
      link: { type: String, maxlength: 200, default: "" }, // એપની અંદરનો રસ્તો, જેમ કે /trader
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 },
    },
    { versionKey: false },
  ).index({ user: 1, createdAt: -1 }),
);

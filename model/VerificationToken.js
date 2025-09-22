// models/VerificationToken.js
import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 60 * 60 * 1000, // ساعة صلاحية
    },
  },
  { timestamps: true }
);

// حذف التوكن أوتوماتيك بعد انتهاء المدة
verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const VerificationToken = mongoose.model("VerificationToken", verificationTokenSchema);

export default VerificationToken;

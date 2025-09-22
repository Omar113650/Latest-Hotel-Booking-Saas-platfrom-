import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TreasuretoSchema = new Schema(
  {
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    category: {
      type: String,
      enum: ["Nature", "Pool", "Shopping", "Beach"],
      required: true,
      trim: true,
    },

    popular: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Treasureto = model("Treasureto", TreasuretoSchema);

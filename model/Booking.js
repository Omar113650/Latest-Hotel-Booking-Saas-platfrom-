import mongoose from "mongoose";

const { Schema, model } = mongoose;

const BookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: "User" },

    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
 { timestamps: true ,
    toJSON: { virtuals: true }, // مهم عشان يظهر virtual لما تعمل JSON
    toObject: { virtuals: true },
  }
);
BookingSchema.virtual("userDetails", {
  ref: "User",           // الموديل اللي عايز تعمله populate
  localField: "user",   // الحقل اللي في الـ HotelSchema
  foreignField: "_id",   // الحقل اللي في الـ User
  justOne: true          // هيرجع object واحد مش array
});

BookingSchema.virtual("hotelDetails", {
  ref: "Hotel",
  localField: "hotel",
  foreignField: "_id",
  justOne: true,
});

export const Booking = model("Booking", BookingSchema);

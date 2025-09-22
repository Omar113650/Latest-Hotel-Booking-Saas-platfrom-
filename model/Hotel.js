import mongoose, { Schema, model } from "mongoose";

const HotelSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    
    hotelName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
      trim: true,
    },

    registrationNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      minlength: 5,
      trim: true,
    },

    facilities: [
      {
        name: { type: String, required: true, trim: true }, // مثال: "Bedroom"
        icon: { type: String, trim: true }, // اسم الأيقونة (اختياري)
        value: { type: String, required: true, trim: true }, // مثال: "1" أو "10 mb/s"
        _id: false,
      },
    ],

    images: [
      {
        url: { type: String, trim: true },
        publicId: { type: String, trim: true },
        _id: false,
      },
    ],

documents: [
  {
    type: {
      type: String,
      enum: ["text", "image"],
      required: true,
    },
    content: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
    _id: false,
  },
],


    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    pricePerDay: {
      type: Number,
      // required: true,
      min: 0,
    },

    statusHotel: {
      type: String,
      enum: ["available", "not available"],
      default: "available",
    },
  },
  { timestamps: true ,
    toJSON: { virtuals: true }, // مهم عشان يظهر virtual لما تعمل JSON
    toObject: { virtuals: true },
  }
);
HotelSchema.virtual("userDetails", {
  ref: "User",           // الموديل اللي عايز تعمله populate
  localField: "user",   // الحقل اللي في الـ HotelSchema
  foreignField: "_id",   // الحقل اللي في الـ User
  justOne: true          // هيرجع object واحد مش array
});



HotelSchema.virtual("hotelDetails", {
  ref: "Booking",
  localField: "Booking",
  foreignField: "_id",
  justOne: true,
});

export const Hotel = model("Hotel", HotelSchema);

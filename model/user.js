import mongoose, { model } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      minlength: 5,
      maxlength: 20,
      required: true,
    },
    Email: {
      type: String,
      minlength: 10,
      maxlength: 50,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    Phone: {
      type: String,
      minlength: 11,
      maxlength: 15,
      required: true,
      unique: true,
    },

    deviceToken: { type: String }, // ⬅️ نخزن توكن Firebase هنا
    Country: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    UserName: {
      type: String,
      minlength: 5,
      maxlength: 20,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    Password: {
      type: String,
      minlength: 6,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "User", "Hotel Owner"],
      default: "User",
    },

    lastLogin: { type: Date },
    oauth: {
      google: {
        id: String,
        email: { type: String },
        name: { type: String },
        picture: { type: String },
        profileUrl: { type: String },
      },
      github: {
        id: String,
        email: { type: String },
        name: { type: String },
        picture: { type: String },
        profileUrl: { type: String },
      },
      microsoft: {
        id: String,
        email: { type: String },
        name: { type: String },
        picture: { type: String },
        profileUrl: { type: String },
      },
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", UserSchema);

export default User;

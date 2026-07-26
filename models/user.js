import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Automatically converts emails to lowercase (e.g., User@Gmail.com -> user@gmail.com)
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      default: "User",
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Standard convention: Capitalize model variables (User instead of user)
const User = mongoose.model("User", userSchema);

export default User;
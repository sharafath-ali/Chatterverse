import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "password must be at least 6 characters long"],
  },
  profilePic: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
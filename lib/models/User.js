import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: "",
  },
  provider: {
    type: String,
    default: "",
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

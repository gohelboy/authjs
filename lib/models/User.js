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
    default: "", // Default value for name
  },
  image: {
    type: String,
    default: "", // Default value for image
  },
  verified: {
    type: Boolean,
    default: false, // Default value for verified
  },
  otp: {
    type: String,
    default: "", // Default value for otp
  },
  provider: {
    type: String,
    default: "", // Default value for otp
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

import mongoose from "mongoose";

// Updated schema with spotifyAccessToken and spotifyRefreshToken
const userSchema = new mongoose.Schema({
  spotifyId: {
    type: String,
    required: true,
  },
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
  spotifyAccessToken: {
    type: String,
    default: "",
  },
  spotifyRefreshToken: {
    type: String,
    default: "",
  },
  location: {
    type: {
      type: String,
      enum: ["Point"], // Specifies GeoJSON type
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
});

userSchema.index({ location: "2dsphere" });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

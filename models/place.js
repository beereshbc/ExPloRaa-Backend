import mongoose from "mongoose";

const placeSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  creator: { type: String, required: true },
  image: { type: String, required: true },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
});

export const Place = mongoose.model("Place", placeSchema);

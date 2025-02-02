import mongoose, { Schema } from "mongoose";

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, uniqu: true },
  password: { type: String, required: true, minlength: 6 },
  places: { type: Number, required: true },
});

export const User = mongoose.model("User", UserSchema);

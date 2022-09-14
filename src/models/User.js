import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: { type:String },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  name: { type: String, required: false },
  location: { type: String },
  socialOnly: { type: Boolean, default: false},
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);

export default User;

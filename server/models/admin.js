import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

mongoose.Promise = global.Promise;

const adminSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },

  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  // Store **hashed** password
  password: {
    type: String,
    required: true,
  },

  privileges: {
    type: String,
    enum: ["standard", "admin", "superadmin"],
    default: "standard",
  },

  is_deleted: {
    type: Boolean,
    default: false,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;

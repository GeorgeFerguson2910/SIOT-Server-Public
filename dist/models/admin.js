import mongoose from "mongoose";
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var adminSchema = new Schema({
  first_name: {
    type: String,
    required: false
  },
  last_name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  password: {
    type: String,
    required: false
  },
  privileges: {
    type: String,
    "default": "standard"
  },
  is_deleted: {
    type: Boolean,
    "default": false
  },
  created_at: {
    type: Date,
    "default": Date.now
  }
});
var Admin = mongoose.model("Admin", adminSchema);
export default Admin;
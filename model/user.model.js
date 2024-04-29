const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "member"],
      default: "member",
    },
    status: { type: String, enum: ["enable", "disable"], default: "enable" },
  },
  { versionKey: false }
);

const UserModel = mongoose.model("users", userSchema);

module.exports = { UserModel };

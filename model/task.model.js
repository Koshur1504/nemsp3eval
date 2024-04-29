const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    priority: {
      type: String,
      enum: ["high", "normal"],
      default: "normal",
    },
    dependencies: [{ type: mongoose.Types.ObjectId }],
    recurring: { type: Boolean, default: false },
    deleteMarked: { type: Boolean, default: false },
    username: { type: String, required: true },
    userID: { type: mongoose.Types.ObjectId, required: true },
  },
  { versionKey: false, timestamps: true }
);

const TaskModel = mongoose.model("tasks", taskSchema);

module.exports = { TaskModel };

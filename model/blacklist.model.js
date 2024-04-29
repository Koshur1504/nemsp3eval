const { default: mongoose } = require("mongoose");

const blackListSchema = new mongoose.Schema(
  {
    accessToken: { type: String, required: true },
  },
  { versionKey: false }
);

const BlacListModel = mongoose.model("blackList", blackListSchema);

module.exports = { BlacListModel };

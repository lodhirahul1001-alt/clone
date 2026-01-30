const mongoose = require("mongoose");

const SubLabelSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
  },
  { timestamps: true }
);

const SubLabel = mongoose.model("SubLabel", SubLabelSchema);

module.exports = { SubLabel };

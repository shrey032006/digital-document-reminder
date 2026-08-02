const mongoose = require("mongoose");

const CATEGORIES = [
  "Aadhaar",
  "PAN",
  "Passport",
  "Driving License",
  "Insurance",
  "Vehicle Registration",
  "Educational Certificate",
  "Other",
];

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    documentName: { type: String, required: true, trim: true },
    documentNumber: { type: String, trim: true },
    category: { type: String, enum: CATEGORIES, default: "Other" },
    issueDate: { type: Date },
    expiryDate: { type: Date, required: true, index: true },
    filePath: { type: String, default: null },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

documentSchema.methods.getStatus = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(this.expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffDays = Math.round((expiry - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { status: "expired", daysLeft: diffDays };
  if (diffDays <= 7) return { status: "urgent", daysLeft: diffDays };
  if (diffDays <= 30) return { status: "soon", daysLeft: diffDays };
  return { status: "valid", daysLeft: diffDays };
};

documentSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    const { status, daysLeft } = doc.getStatus();
    ret.status = status;
    ret.daysLeft = daysLeft;
    return ret;
  },
});

module.exports = mongoose.model("Document", documentSchema);
module.exports.CATEGORIES = CATEGORIES;

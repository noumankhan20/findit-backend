import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoundItem", // or LostItem (we'll handle both later)
      required: true,
    },

    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    claimerName: String,
    claimerEmail: String,

    itemName: String,
    description: String,
    lastSeenLocation: String,
    lastSeenDate: Date,
    additionalNote: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "matched", "review"],
      default: "pending",
    },
    matchScore: {
      type: Number,
    },
    aiReason: {
      type: String,
    },
    answers: {
      brand: { type: String },
      color: { type: String },
      uniqueMark: { type: String },
      exactLocation: { type: String },
    }

  },
  { timestamps: true }
);

export const Claim = mongoose.model("Claim", claimSchema);
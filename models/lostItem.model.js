import mongoose from "mongoose";

const lostItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    location: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
    },
    images: [
      {
        type: String, // store file path or URL
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // optional (if auth exists)
    },
  },
  { timestamps: true }
);

export const LostItem = mongoose.model("LostItem", lostItemSchema);
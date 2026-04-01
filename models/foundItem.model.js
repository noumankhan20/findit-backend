import mongoose from "mongoose";

const foundItemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
        type: String,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brand: String,
    color: String,
    uniqueMark: String, // scratch, sticker, etc.
    exactLocation: String, // more precise than public location
  },
  { timestamps: true }
);

export const FoundItem = mongoose.model("FoundItem", foundItemSchema);
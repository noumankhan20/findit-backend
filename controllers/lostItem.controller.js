import { LostItem } from "../models/lostItem.model.js";

export const createLostItem = async (req, res) => {
  try {
    const { itemName, description, location, dateTime } = req.body;

    const imagePaths = req.files?.map(file => file.path) || [];

    const lostItem = await LostItem.create({
      itemName,
      description,
      location,
      dateTime,
      images: imagePaths,
      user: req.user.id, // 🔥 LINK USER
    });

    res.status(201).json({
      success: true,
      message: "Lost item reported successfully",
      data: lostItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getAllLostItems = async (req, res) => {
  try {
    const items = await LostItem.find()
      .populate("user", "name email") // optional
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Get Lost Items Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMyLostItems = async (req, res) => {
  try {
    const items = await LostItem.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

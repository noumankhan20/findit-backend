import { FoundItem } from "../models/foundItem.model.js";

export const createFoundItem = async (req, res) => {
  try {
    const {
      itemName,
      description,
      location,
      dateTime,

      // 🔒 NEW hidden fields
      brand,
      color,
      uniqueMark,
      exactLocation,

    } = req.body;

    const imagePaths = req.files?.map(file => file.path) || [];
    if (!brand || !color) {
      return res.status(400).json({
        success: false,
        message: "Brand and color are required for verification",
      });
    }
    const foundItem = await FoundItem.create({
      itemName,
      description,
      location,
      dateTime,
      images: imagePaths,
      user: req.user.id,

      // 🔒 SAVE hidden fields
      brand,
      color,
      uniqueMark,
      exactLocation,
    });

    res.status(201).json({
      success: true,
      message: "Found item reported successfully",
      data: foundItem,
    });
  } catch (error) {
    console.error("Create Found Item Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getAllFoundItems = async (req, res) => {
  try {
    const items = await FoundItem.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Get Found Items Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMyFoundItems = async (req, res) => {
  try {
    const items = await FoundItem.find({ user: req.user.id });

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


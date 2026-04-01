import jwt from "jsonwebtoken"
import crypto from "crypto"
import User from "../models/user.model.js"
import { LostItem } from "../models/lostItem.model.js";
import { FoundItem } from "../models/foundItem.model.js"
import { sendOtpEmail } from "../utils/claimEmail.js";
export const signup = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // ✅ Validation
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or phone",
      });
    }

    // ✅ Create user
    const user = await User.create({
      name,
      phone,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  res.json({
    user: req.user,
  });
};

export const getMyItems = async (req, res) => {
  try {
    // 1. Get lost items
    const lostItems = await LostItem.find({ user: req.user.id });

    // 2. Get found items
    const foundItems = await FoundItem.find({ user: req.user.id });
    console.log("USER ID:", req.user.id);
    // 3. Add type field (VERY IMPORTANT for frontend)
    const formattedLost = lostItems.map(item => ({
      ...item._doc,
      status: "lost",
    }));

    const formattedFound = foundItems.map(item => ({
      ...item._doc,
      status: "found",
    }));

    // 4. Merge + sort latest first
    const allItems = [...formattedLost, ...formattedFound].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
      success: true,
      count: allItems.length,
      data: allItems,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    const { name, phone, email, password } = req.body;

    // ✅ Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Check if email/phone already used by someone else
    if (email || phone) {
      const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
        _id: { $ne: userId }, // exclude current user
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email or phone already in use",
        });
      }
    }

    // ✅ Update fields (only if provided)
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;

    // ✅ Optional password update
    if (password) {
      user.password = password; // (assuming you hash in pre-save middleware)
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    await sendOtpEmail({
      email,
      otp,
    });

    res.status(200).json({
      message: "OTP sent to your email",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // ✅ Update password
    user.password = password;

    // clear OTP
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
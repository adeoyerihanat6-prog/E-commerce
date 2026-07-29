import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

// @desc    Get all users
// @route   GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await user.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register user
// @route   POST /api/users/register
const registerUser = async (req, res) => {
  const { name, email, password, contact } = req.body;

  try {
    const existingUser = await user.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await user.create({
      name,
      email,
      password: hashedPassword,
      contact,
    });

    // Send email without blocking registration
    sendEmail({
      to: newUser.email,
      subject: "🎉 Welcome to Velora!",
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2 style="color:#7C3AED;">Welcome to Velora, ${newUser.name}! 🎉</h2>
          <p>Thank you for creating an account with <strong>Velora</strong>.</p>
          <p>We're excited to have you join our community of shoppers.</p>
          <ul>
            <li>🛍️ Browse thousands of products</li>
            <li>❤️ Save your favourite items</li>
            <li>🛒 Place orders securely</li>
            <li>📦 Track your orders</li>
          </ul>
          <p>Happy Shopping! ✨</p>
          <hr>
          <p style="color:#777;font-size:13px;">Team Velora</p>
        </div>
      `,
    }).catch((err) => {
      console.error("Email send failed:", err);
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET || "fallback_secret_key",
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        contact: newUser.contact,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:userId
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, password, contact } = req.body;

  try {
    const updateData = { name, email, contact };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user
      .findByIdAndUpdate(userId, updateData, {
        new: true,
      })
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:userId
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await user.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const User = await user.findOne({ email });

    if (!User) {
      return res.status(400).json({
        message: "Account doesn't exist",
      });
    }

    const isMatch = await bcrypt.compare(password, User.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        id: User._id,
        role: User.role,
      },
      process.env.JWT_SECRET || "fallback_secret_key",
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: User._id,
        name: User.name,
        email: User.email,
        role: User.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// @desc    Role Authorization Middleware
const authorize = (roles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret_key"
      );

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({
          message: "Forbidden: Insufficient privileges",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
};

export {
  registerUser,
  getAllUsers,
  updateUser,
  deleteUser,
  login,
  authorize,
};
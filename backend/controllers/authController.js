import User from '../models/User.js';
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import randomstring from "randomstring";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: config.emailService,
  port: config.emailPort,
  secure: config.emailSecure,
  auth: {
    user: config.emailUser,
    pass: config.emailPassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const register = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;
    
    // Validation
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ 
      full_name, 
      email, 
      password_hash: hashed, 
      role: role || 'sales' 
    });
    
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
    
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed", detail: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    req.session.user = { 
      id: user._id, 
      role: user.role,
      email: user.email,
      full_name: user.full_name
    };
    
    res.json({ 
      message: "Login successful", 
      role: user.role,
      email: user.email,
      full_name: user.full_name
    });
    
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed", detail: err.message });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
};

export const currentUser = (req, res) => {
  console.log("Session:", req.session);
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
};

// export const forgotPassword = async (req, res) => {
//   try {
//     console.log("Forgot password request received for email:", req.body.email);

//     const { email } = req.body;
//     if (!email) {
//       console.log("No email provided");
//       return res.status(400).json({ message: "Email is required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("Email not found in database:", email);
//       return res.status(404).json({ message: "Email not found" });
//     }

//     // Generate reset token
//     const resetToken = randomstring.generate();
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//     await user.save();

//     // Send reset email
//     const resetLink = `${config.baseUrl}/reset-password?token=${resetToken}`;

//     console.log("Reset token generated for user:", user.email);

//     await transporter.sendMail({
//       from: config.emailFrom,
//       to: user.email,
//       subject: "Password Reset",
//       text: `Click this link to reset your password: ${resetLink}`,
//       html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
//     });
//     console.log("Reset email sent successfully to:", email);

//     res.json({ message: "Password reset email sent successfully" });
//   } catch (error) {
//     console.error("Full forgot password error:", error);
//     console.error("Error stack:", error.stack);
//     res.status(500).json({
//       message: "Failed to process request",
//       error: error.message,
//     });
//   }
// };

// export const resetPassword = async (req, res) => {
//   try {
//     const { token, password } = req.body;

//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired token" });
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password_hash = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.json({ message: "Password reset successfully" });
//   } catch (error) {
//     console.error("Reset password error:", error);
//     res.status(500).json({ message: "Failed to reset password", error: error.message });
//   }
// };
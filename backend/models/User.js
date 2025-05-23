import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'sales'], default: 'sales' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password_hash);
};

const User = mongoose.model('User', userSchema);
export default User;
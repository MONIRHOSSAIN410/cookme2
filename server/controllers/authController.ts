import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel, memoryUsers, MemoryUser } from "../models/User.js";
import { generateToken, AuthenticatedRequest } from "../middleware/authMiddleware.js";

// Input validation helpers
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidBDPhone(phone: string): boolean {
  const clean = phone.replace(/[\s-]/g, "");
  return /^01[3-9]\d{8}$/.test(clean) || /^\+8801[3-9]\d{8}$/.test(clean);
}

export async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, phone, password } = req.body;

    // Validation checks
    const errors: Record<string, string> = {};

    if (!name || name.trim().length < 2) {
      errors.name = "Full Name is required (minimum 2 characters)";
    }

    if (!email || !isValidEmail(email)) {
      errors.email = "Please provide a valid email address";
    }

    if (!phone || !isValidBDPhone(phone)) {
      errors.phone = "Please provide a valid 11-digit Bangladeshi mobile number (e.g. 01XXXXXXXXX)";
    }

    if (!password || password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors, message: "Validation error. Please check your inputs." });
    }

    const cleanPhone = phone.replace(/[\s-]/g, "");
    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingMemUser = memoryUsers.find(
      (u) => u.email === cleanEmail || u.phone === cleanPhone
    );

    if (existingMemUser) {
      return res.status(400).json({
        success: false,
        message: existingMemUser.email === cleanEmail ? "Email is already registered" : "Phone number is already registered"
      });
    }

    // Try MongoDB if connected
    try {
      const existingDbUser = await UserModel.findOne({
        $or: [{ email: cleanEmail }, { phone: cleanPhone }]
      } as any);
      if (existingDbUser) {
        return res.status(400).json({
          success: false,
          message: existingDbUser.email === cleanEmail ? "Email is already registered" : "Phone number is already registered"
        });
      }

      const dbUser = await UserModel.create({
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password,
        role: "customer",
        loyaltyPoints: 50
      });

      const token = generateToken({
        id: dbUser._id.toString(),
        email: dbUser.email,
        phone: dbUser.phone,
        role: dbUser.role
      });

      return res.status(201).json({
        success: true,
        message: "Account created successfully! Welcome to CookMe.",
        token,
        user: {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          phone: dbUser.phone,
          role: dbUser.role,
          loyaltyPoints: dbUser.loyaltyPoints,
          addresses: dbUser.addresses || []
        }
      });
    } catch {
      // Fall through to memory store
    }

    // Memory Store Creation
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newMemUser: MemoryUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash,
      role: "customer",
      loyaltyPoints: 50,
      addresses: [],
      createdAt: new Date().toISOString()
    };

    memoryUsers.push(newMemUser);

    const token = generateToken({
      id: newMemUser.id,
      email: newMemUser.email,
      phone: newMemUser.phone,
      role: newMemUser.role
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully! Welcome to CookMe.",
      token,
      user: {
        id: newMemUser.id,
        name: newMemUser.name,
        email: newMemUser.email,
        phone: newMemUser.phone,
        role: newMemUser.role,
        loyaltyPoints: newMemUser.loyaltyPoints,
        addresses: newMemUser.addresses
      }
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error during registration" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your Phone/Email and password"
      });
    }

    const cleanIdentifier = identifier.trim();

    // Check memory store
    const memUser = memoryUsers.find(
      (u) => u.email.toLowerCase() === cleanIdentifier.toLowerCase() || u.phone === cleanIdentifier.replace(/[\s-]/g, "")
    );

    if (memUser) {
      const isMatch = await bcrypt.compare(password, memUser.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials. Please check your password." });
      }

      const token = generateToken({
        id: memUser.id,
        email: memUser.email,
        phone: memUser.phone,
        role: memUser.role
      });

      return res.json({
        success: true,
        message: `Welcome back, ${memUser.name}!`,
        token,
        user: {
          id: memUser.id,
          name: memUser.name,
          email: memUser.email,
          phone: memUser.phone,
          role: memUser.role,
          loyaltyPoints: memUser.loyaltyPoints,
          addresses: memUser.addresses
        }
      });
    }

    // Try MongoDB
    try {
      const dbUser = await UserModel.findOne({
        $or: [
          { email: cleanIdentifier.toLowerCase() },
          { phone: cleanIdentifier.replace(/[\s-]/g, "") }
        ]
      } as any);

      if (dbUser) {
        const isMatch = await dbUser.matchPassword(password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: "Invalid credentials. Please check your password." });
        }

        const token = generateToken({
          id: dbUser._id.toString(),
          email: dbUser.email,
          phone: dbUser.phone,
          role: dbUser.role
        });

        return res.json({
          success: true,
          message: `Welcome back, ${dbUser.name}!`,
          token,
          user: {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            phone: dbUser.phone,
            role: dbUser.role,
            loyaltyPoints: dbUser.loyaltyPoints,
            addresses: dbUser.addresses || []
          }
        });
      }
    } catch {
      // Fall through
    }

    return res.status(401).json({ success: false, message: "Account not found with this Phone/Email. Please Sign Up." });
  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error during login" });
  }
}

export async function getCurrentUser(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  return res.json({
    success: true,
    user: req.user
  });
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const { name, addresses } = req.body;

  // Update in memory
  const memUser = memoryUsers.find((u) => u.id === req.user?.id);
  if (memUser) {
    if (name) memUser.name = name.trim();
    if (addresses) memUser.addresses = addresses;
    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        phone: memUser.phone,
        role: memUser.role,
        loyaltyPoints: memUser.loyaltyPoints,
        addresses: memUser.addresses
      }
    });
  }

  return res.json({ success: true, message: "Profile updated", user: req.user });
}

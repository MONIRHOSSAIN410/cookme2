import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel, memoryUsers } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "cookme_super_secret_jwt_key_2026";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    loyaltyPoints: number;
    addresses: any[];
  };
}

export function generateToken(user: { id: string; email: string; phone: string; role: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, phone: user.phone, role: user.role },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

export async function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    // Try finding in MongoDB first
    try {
      const userDoc = await (UserModel as any).findById(decoded.id).select("-password");
      if (userDoc) {
        req.user = {
          id: userDoc._id.toString(),
          name: userDoc.name,
          email: userDoc.email,
          phone: userDoc.phone,
          role: userDoc.role,
          loyaltyPoints: userDoc.loyaltyPoints,
          addresses: userDoc.addresses || []
        };
        return next();
      }
    } catch {
      // Fallback
    }

    // Check memory store
    const memUser = memoryUsers.find((u) => u.id === decoded.id || u.email === (decoded as any).email);
    if (memUser) {
      req.user = {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        phone: memUser.phone,
        role: memUser.role,
        loyaltyPoints: memUser.loyaltyPoints,
        addresses: memUser.addresses || []
      };
      return next();
    }

    return res.status(401).json({ success: false, message: "User session expired or not found" });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

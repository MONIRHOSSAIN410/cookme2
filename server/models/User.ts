import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'customer' | 'admin';
  loyaltyPoints: number;
  addresses: {
    id: string;
    label: string;
    street: string;
    city: string;
    district: string;
    phone: string;
    isDefault: boolean;
  }[];
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    loyaltyPoints: { type: Number, default: 50 },
    addresses: [
      {
        id: { type: String, default: () => `addr-${Date.now()}` },
        label: { type: String, default: 'Home' },
        street: { type: String, required: true },
        city: { type: String, default: 'Dhaka' },
        district: { type: String, default: 'Dhaka' },
        phone: { type: String },
        isDefault: { type: Boolean, default: true }
      }
    ]
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Fallback in-memory database store
export interface MemoryUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: 'customer' | 'admin';
  loyaltyPoints: number;
  addresses: {
    id: string;
    label: string;
    street: string;
    city: string;
    district: string;
    phone: string;
    isDefault: boolean;
  }[];
  createdAt: string;
}

// Initial demo user: "adnan" / "shakib" from screenshots
const demoPasswordHash = bcrypt.hashSync("password123", 10);

export const memoryUsers: MemoryUser[] = [
  {
    id: "user-demo-1",
    name: "adnan shakib",
    email: "adnan@cookme.com",
    phone: "01711254089",
    passwordHash: demoPasswordHash,
    role: "customer",
    loyaltyPoints: 120,
    addresses: [
      {
        id: "addr-1",
        label: "Home",
        street: "House 14, Road 5, Dhanmondi",
        city: "Dhaka",
        district: "Dhaka",
        phone: "01711254089",
        isDefault: true
      },
      {
        id: "addr-2",
        label: "Office",
        street: "Level 4, Rikabi Bazar",
        city: "Sylhet",
        district: "Sylhet",
        phone: "01911970994",
        isDefault: false
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

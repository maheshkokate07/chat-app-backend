import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string,
    email: string,
    username: string,
    password: string,
    avatarUrl: string,
    isActive: boolean
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    avatarUrl: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    _id: string,
    name: string,
    email: string,
    username: string,
    password: string,
    avatarUrl: string,
    friends: mongoose.Types.ObjectId[],
    blockedUsers: mongoose.Types.ObjectId[]
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    avatarUrl: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
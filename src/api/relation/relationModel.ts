import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRelation extends Document {
    _id: Types.ObjectId,
    userA: Types.ObjectId,
    userB: Types.ObjectId,
    requestedBy: Types.ObjectId | null,
    friends: boolean,
    blockedBy: Types.ObjectId[]
}

const RelationSchema = new Schema<IRelation>({
    userA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userB: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    friends: { type: Boolean, default: false },
    blockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

RelationSchema.index({ userA: 1, userB: 1 }, { unique: true });

export default mongoose.model<IRelation>('Relation', RelationSchema);
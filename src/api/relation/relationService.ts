import { Types } from 'mongoose';
import { AppError } from '../../utils/appError';
import { sortUserIds } from '../../utils/sortUserIds';
import User from '../auth/authModel'
import Relation, { IRelation } from './relationModel';

interface RelationActionData {
    fromId: Types.ObjectId | string;
    toId: Types.ObjectId | string;
}

const relationService = {
    sendRequest: async (data: RelationActionData) => {
        const fromUser = await User.findById(data.fromId);
        const toUser = await User.findById(data.toId);

        if (!fromUser || !toUser)
            throw new AppError('User not exist', 404);

        const [userA, userB] = sortUserIds(data.fromId, data.toId);

        if (userA.toString() === userB.toString())
            throw new AppError("You cannot send request to yourself", 400);

        const existingRelation: IRelation | null = await Relation.findOne({ userA, userB });

        if (existingRelation?.friends)
            throw new AppError("You are already friends", 400);

        // If toUser has blocked fromUser
        if (existingRelation?.blockedBy.some(id => id.toString() === data.toId.toString()))
            throw new AppError("You cannot send the request to this user", 400);

        // If fromUser has blocked toUser
        if (existingRelation?.blockedBy.some(id => id.toString() === data.fromId.toString()))
            throw new AppError("Unblock user before sending request", 400);

        if (existingRelation) {
            if (existingRelation.requestedBy?.toString() === data.toId.toString()) {
                existingRelation.requestedBy = null;
                existingRelation.friends = true;
                await existingRelation.save();
                return;
            } else if (existingRelation.requestedBy?.toString() === data.fromId.toString()) {
                throw new AppError("Friend request already sent", 400);
            }
        }

        const relation = new Relation({ userA, userB, requestedBy: data.fromId });
        await relation.save();
        return;
    },

    acceptRequest: async (data: RelationActionData) => {
        const fromUser = await User.findById(data.fromId);
        const toUser = await User.findById(data.toId);

        if (!fromUser || !toUser)
            throw new AppError('User not exist', 404);

        const [userA, userB] = sortUserIds(data.fromId, data.toId);

        if (userA.toString() === userB.toString())
            throw new AppError("You cannot accept request of yourself", 400);

        const existingRelation: IRelation | null = await Relation.findOne({ userA, userB, requestedBy: data.toId });

        if (!existingRelation)
            throw new AppError("No friend request exists", 404);

        // Check if acceptor has blocked requester
        if (existingRelation.blockedBy.some(id => id.toString() === data.fromId.toString()))
            throw new AppError("Unblock user before accepting request", 400);

        // Check if requester has blocked acceptor 
        if (existingRelation.blockedBy.some(id => id.toString() === data.toId.toString()))
            throw new AppError("You cannot accept this request", 400);

        // Accept request
        existingRelation.set({
            requestedBy: null,
            friends: true
        });

        await existingRelation.save();
        return;
    },

    rejectRequest: async (data: RelationActionData) => {
        const fromUser = await User.findById(data.fromId);
        const toUser = await User.findById(data.toId);

        if (!fromUser || !toUser)
            throw new AppError('User not exist', 404);

        const [userA, userB] = sortUserIds(data.fromId, data.toId);

        if (userA.toString() === userB.toString())
            throw new AppError("You cannot reject request of yourself", 400);

        const existingRelation: IRelation | null = await Relation.findOne({ userA, userB, requestedBy: data.toId });

        if (!existingRelation)
            throw new AppError("No friend request exists", 404);

        // Check if rejector has blocked requester
        if (existingRelation.blockedBy.some(id => id.toString() === data.fromId.toString()))
            throw new AppError("Unblock user before rejecting request", 400);

        // Check if requester has blocked rejector
        if (existingRelation.blockedBy.some(id => id.toString() === data.toId.toString()))
            throw new AppError("You cannot reject this request", 400);

        // Delete(reject) request
        await existingRelation.deleteOne();
        return;
    },

    blockUser: async (data: RelationActionData) => {
        const fromUser = await User.findById(data.fromId);
        const toUser = await User.findById(data.toId);

        if (!fromUser || !toUser)
            throw new AppError("User not exist", 404);

        const [userA, userB] = sortUserIds(data.fromId, data.toId);

        if (userA.toString() === userB.toString())
            throw new AppError("You cannot block yourself", 400);

        await Relation.updateOne(
            { userA, userB },
            {
                $addToSet: { blockedBy: data.fromId }
            },
            { upsert: true }
        );

        return;
    },

    unblockUser: async (data: RelationActionData) => {
        const fromUser = await User.findById(data.fromId);
        const toUser = await User.findById(data.toId);

        if (!fromUser || !toUser)
            throw new AppError("User not exist", 404);

        const [userA, userB] = sortUserIds(data.fromId, data.toId);

        if (userA.toString() === userB.toString())
            throw new AppError("You cannot unblock yourself", 400);

        await Relation.updateOne(
            { userA, userB },
            { $pull: { blockedBy: data.fromId } }
        );

        // Clean up the relation document if empty (no friends, no requests, no blocks)
        const updated = await Relation.findOne({ userA, userB });
        if (
            updated &&
            !updated.friends &&
            updated.requestedBy === null &&
            updated.blockedBy.length === 0
        ) {
            await updated.deleteOne();
        }

        return;
    },

    unfriendUser: async (data: RelationActionData) => {
        const fromUser = await User.findById(data.fromId);
        const toUser = await User.findById(data.toId);

        if (!fromUser || !toUser)
            throw new AppError("User not exist", 404);

        const [userA, userB] = sortUserIds(data.fromId, data.toId);

        if (userA.toString() === userB.toString())
            throw new AppError("You cannot unfriend yourself", 400);

        const existingRelation: IRelation | null = await Relation.findOne({ userA, userB, friends: true });

        if (!existingRelation)
            throw new AppError("No relation exists", 404);

        // Remove the friendship
        existingRelation.friends = false;

        if (
            existingRelation.requestedBy === null &&
            existingRelation.blockedBy.length === 0
        ) {
            await existingRelation.deleteOne();
        } else {
            await existingRelation.save();
        }

        return;
    }
}

export default relationService;
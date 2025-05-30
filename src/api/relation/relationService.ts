import { Types } from 'mongoose';
import { AppError } from '../../utils/appError';
import { sortUserIds } from '../../utils/sortUserIds';
import User from '../auth/authModel'
import Relation, { IRelation } from './relationModel';

const relationService = {
    sendRequest: async (data: any) => {
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
        if (existingRelation?.blockedBy.some(id => id.toString() === data.toId))
            throw new AppError("You cannot send the request to this user", 400);

        // If fromUser has blocked toUser
        if (existingRelation?.blockedBy.some(id => id.toString() === data.fromId))
            throw new AppError("Unblock user before sending request", 400);

        if (existingRelation) {
            if (existingRelation.requestedBy?.toString() === data.toId) {
                existingRelation.requestedBy = null;
                existingRelation.friends = true;
                await existingRelation.save();
                return;
            } else if (existingRelation.requestedBy?.toString() === data.fromId) {
                throw new AppError("Friend request already sent", 400);
            }
        }

        const relation = new Relation({ userA, userB, requestedBy: data.fromId });
        await relation.save();
        return;
    },

    acceptRequest: async (data: any) => {
        const existingRelation = await Relation.findOne({ _id: data.relationId });

        if (!existingRelation)
            throw new AppError("No friend request exists", 404);

        if (existingRelation.userA.toString() !== data.userId && existingRelation.userB.toString() !== data.userId)
            throw new AppError("This is not your request", 403);

        if (!existingRelation.requestedBy)
            throw new AppError("No pending request to accept", 400);

        if (existingRelation.requestedBy.toString() === data.userId)
            throw new AppError("You cannot accept your own request", 400);

        const requesterId = existingRelation.requestedBy.toString();
        const acceptorId = data.userId;

        // Check if acceptor has blocked requester
        if (existingRelation.blockedBy.some(id => id.toString() === acceptorId))
            throw new AppError("Unblock user before accepting request", 400);

        // Check if requester has blocked acceptor 
        if (existingRelation.blockedBy.some(id => id.toString() === requesterId))
            throw new AppError("You cannot accept this request", 400);

        // Accept request
        existingRelation.set({
            requestedBy: null,
            friends: true
        });

        await existingRelation.save();
        return;
    },

    rejectRequest: async (data: any) => {
        const existingRelation = await Relation.findOne({ _id: data.relationId });

        if (!existingRelation)
            throw new AppError("No friend request exists", 404);

        if (existingRelation.userA.toString() !== data.userId && existingRelation.userB.toString() !== data.userId)
            throw new AppError("This is not your request", 403);

        if (!existingRelation.requestedBy)
            throw new AppError("No pending request to reject", 400);

        if (existingRelation.requestedBy.toString() === data.userId)
            throw new AppError("You cannot reject your own request", 400);

        const requesterId = existingRelation.requestedBy.toString();
        const rejectorId = data.userId;

        // Check if rejector has blocked requester
        if (existingRelation.blockedBy.some(id => id.toString() === rejectorId))
            throw new AppError("Unblock user before rejecting request", 400);

        // Check if requester has blocked rejector 
        if (existingRelation.blockedBy.some(id => id.toString() === requesterId))
            throw new AppError("You cannot reject this request", 400);

        // Delte(reject) request
        await existingRelation.deleteOne();
        return;
    },
}

export default relationService;
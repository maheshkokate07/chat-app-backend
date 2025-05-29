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

        const existingRelation: IRelation | null = await Relation.findOne({ userA, userB });

        if (existingRelation?.friends)
            throw new AppError("You are already friends", 400);

        if (existingRelation?.blockedBy.includes(data.toId))
            throw new AppError("You cannot send the request to this user", 400);

        if (existingRelation?.blockedBy.includes(data.fromId))
            throw new AppError("Unblock user before sending request", 400);

        if (existingRelation) {
            if (existingRelation.requestedBy === data.toId) {
                existingRelation.requestedBy = null;
                existingRelation.friends = true;
                await existingRelation.save();
                return;
            } else if (existingRelation.requestedBy === data.fromId) {
                throw new AppError("Friend request already sent", 400);
            }
        }

        const relation = new Relation({ userA, userB, requestedBy: data.fromId });
        await relation.save();
        return;
    }
}
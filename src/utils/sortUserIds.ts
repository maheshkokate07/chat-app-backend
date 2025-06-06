import { Types } from "mongoose";

export const sortUserIds = (id1: Types.ObjectId | string, id2: Types.ObjectId | string) => {
    return id1.toString() < id2.toString() ? [id1, id2] : [id2, id1];
}
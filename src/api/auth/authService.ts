import { AppError } from '../../utils/appError';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwtUtils';
import User from './authModel';
import { v4 as uuidv4 } from 'uuid';

const authService = {
    register: async (data: any) => {
        const existingUser = await User.findOne({ email: data.email });

        if (existingUser)
            throw new AppError('Email already exists', 409)

        const user = new User(data);
        const savedUser = await user.save();

        const sessionId = uuidv4();

        const accessToken = generateAccessToken({
            userId: savedUser._id,
            userName: savedUser.username,
            email: savedUser.email,
            sessionId: sessionId
        });

        const refreshToken = generateRefreshToken({
            userId: savedUser._id,
            sessionId: sessionId
        })

        return { accessToken, refreshToken };
    }
}

export default authService;
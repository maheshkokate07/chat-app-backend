import { AppError } from '../../utils/appError';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwtUtils';
import User from './authModel';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'

const authService = {
    register: async (data: any) => {
        const existingUser = await User.findOne({ email: data.email });

        if (existingUser)
            throw new AppError('Email already exists', 409)

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = new User({ ...data, password: hashedPassword });
        const savedUser = await user.save();

        const sessionId = uuidv4();

        const accessToken = generateAccessToken({
            userId: savedUser._id,
            userName: savedUser.username,
            name: savedUser.name,
            email: savedUser.email,
            sessionId: sessionId
        });

        const refreshToken = generateRefreshToken({
            userId: savedUser._id,
            sessionId: sessionId
        })

        return { accessToken, refreshToken };
    },

    login: async (data: any) => {
        const existingUser = await User.findOne({ email: data.email });

        if (!existingUser)
            throw new AppError('User with this email is not registered', 404)

        const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);

        if (!isPasswordValid)
            throw new AppError('Invalid credentials');

        const sessionId = uuidv4();

        const accessToken = generateAccessToken({
            userId: existingUser._id,
            userName: existingUser.username,
            name: existingUser.name,
            email: existingUser.email,
            sessionId: sessionId
        })

        const refreshToken = generateRefreshToken({
            userId: existingUser._id,
            sessionId: sessionId
        })

        return { accessToken, refreshToken };
    }
}

export default authService;
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET: any = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET: any = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRY: any = process.env.ACCESS_TOKEN_EXPIRY
const REFRESH_TOKEN_EXPIRY: any = process.env.REFRESH_TOKEN_EXPIRY

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
        throw err;
    }
}

export const generateAccessToken = (data: any) => {
    return jwt.sign(
        data,
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )
}

export const generateRefreshToken = (data: any) => {
    return jwt.sign(
        data,
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    )
}
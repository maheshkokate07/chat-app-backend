import dotenv from 'dotenv';
import express, { Application } from 'express';
import { connectDB } from './src/config/mongoDB';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { socketHandler, onlineUsers } from './src/socket';
import masterRouter from './src/routes/v1/masterRoute';
import { apiRateLimiter } from './src/middlewares/rateLimiter';
import { errorHandler } from './src/middlewares/errorHandler';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
    },
});

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

socketHandler(io);

app.use("/api/v1/", apiRateLimiter, masterRouter);

app.use(errorHandler);

const PORT = process.env.PORT;
httpServer.listen(PORT, () =>
    console.log(`Server running on PORT: ${PORT}`)
);

export { io, onlineUsers };
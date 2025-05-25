import dotenv from 'dotenv';
import express, { Application } from 'express';
import { connectDB } from './src/config/mongoDB';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { socketHandler, onlineUsers } from './src/socket';

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

const PORT = process.env.PORT;
httpServer.listen(PORT, () =>
    console.log(`Server running on PORT: ${PORT}`)
);

export { io, onlineUsers };
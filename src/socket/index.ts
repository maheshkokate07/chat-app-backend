import { Server, Socket } from "socket.io";

const onlineUsers: Map<string, string> = new Map();

export const socketHandler = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("New user connected:", socket.id);

        socket.on("join", (userId: string) => {
            if (userId) {
                onlineUsers.set(userId, socket.id);
                console.log(`User ${userId} is online`);
            }
        });

        socket.on("leave", (userId: string) => {
            if (userId) {
                onlineUsers.delete(userId);
                console.log(`User ${userId} has left`);
            }
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });
};

export { onlineUsers };
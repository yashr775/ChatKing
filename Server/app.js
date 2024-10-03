import express from "express";
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/errors.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS } from "./constants/event.js";
import { v4 as uuid } from "uuid"
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import cors from "cors";

dotenv.config({
    path: "./.env",
});

const mongoURI = process.env.MONGO_URI;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";

const app = express();
const server = createServer(app);
const io = new Server(server, {});

const PORT = process.env.PORT || 3000;
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "This is secret";
const userSocketIDs = new Map();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://http://localhost:5173", "http://localhost:4173", process.env.CLIENT_URL],
    credentials: true

}))

connectDB(mongoURI);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const user = {
        _id: "hjafgsajh",
        name: "kugsdfjasdjahs"
    }

    userSocketIDs.set(user._id.toString(), socket.id)
    console.log(userSocketIDs)

    socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
        const messageForRealTime = {
            content: message,
            _id: uuid(),
            sender: {
                _id: user._id,
                name: user.name,
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        };

        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId,
        };

        const membersSocket = getSockets(members, userSocketIDs)
        io.to(membersSocket).emit(NEW_MESSAGE, { chatId, message: messageForRealTime });
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId })

        try {
            await Message.create(messageForDB)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on("disconnect", () => {
        userSocketIDs.delete(user._id.toString());
        console.log("User disconnected");
    });
});

app.use(errorMiddleware);

server.listen(3000, () => {
    console.log(`App is listening on ${PORT} in ${envMode}`);
});

export { envMode, adminSecretKey };

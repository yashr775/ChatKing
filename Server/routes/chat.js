import { isAuthenticated } from "../middlewares/auth.js";
import {
    addMembers,
    deleteChat,
    getChatDetails,
    getMessages,
    getMyChats,
    getMyGroups,
    leaveGroup,
    newGroupChat,
    removeMember,
    renameGroup,
    sendAttachment,
} from "../controllers/chat.js";
import express from "express";
import { attachmentMulter } from "../middlewares/multer.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/new", newGroupChat);

app.get("/my", getMyChats);

app.get("/my/groups", getMyGroups);

app.put("/addmembers", addMembers);

app.put("/removemember", removeMember);

app.delete("/leave/:id", leaveGroup);

app.get("/message/:id", getMessages)

app.post("/message", attachmentMulter, sendAttachment);

app.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteChat);
export default app;

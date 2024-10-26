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
import {
    chatIdValidator,
    addMemberValidator,
    newGroupValidator,
    removeMemberValidator,
    sendAttachmentsValidator,
    validateHandler,
    renameValidator,
} from "../lib/validators.js";

const app = express.Router();

app.use(isAuthenticated);

app.post("/new", newGroupValidator(), newGroupChat);

app.get("/my", getMyChats);

app.get("/my/groups", getMyGroups);

app.put("/addmembers", addMemberValidator(), addMembers);

app.put("/removemember", removeMemberValidator(), removeMember);

app.delete("/leave/:id", leaveGroup);

app.get("/message/:id", getMessages);

app.post(
    "/message",
    attachmentMulter,
    sendAttachmentsValidator(),
    validateHandler,
    sendAttachment
);

app
    .route("/:id")
    .get(chatIdValidator(), validateHandler, getChatDetails)
    .put(renameValidator(), validateHandler, renameGroup)
    .delete(chatIdValidator(), validateHandler, deleteChat);
export default app;

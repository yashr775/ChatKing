import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, getChatDetails, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, sendAttachment } from "../controllers/chat.js";
import express from "express"
import { attachmentMulter } from "../middlewares/multer.js";

const app = express.Router();

app.use(isAuthenticated);

app.post('/new', newGroupChat)

app.get('/my', getMyChats)

app.get('/my/groups', getMyGroups)

app.put('/addmembers', addMembers)

app.put('/removemember', removeMember)

app.delete("/leave/:id", leaveGroup)

app.post("/message", attachmentMulter, sendAttachment)

app.route("/:id").get(getChatDetails)
export default app;
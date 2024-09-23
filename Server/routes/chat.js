import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, getMyChats, getMyGroups, newGroupChat, removeMember } from "../controllers/chat.js";
import express from "express"

const app = express.Router();

app.use(isAuthenticated);

app.post('/new', newGroupChat)

app.get('/my', getMyChats)

app.get('/my/groups', getMyGroups)

app.put('/addmembers', addMembers)

app.put('/removemember', removeMember)

export default app;
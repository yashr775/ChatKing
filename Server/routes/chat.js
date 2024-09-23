import { isAuthenticated } from "../middlewares/auth.js";
import { getMyChats, getMyGroups, newGroupChat } from "../controllers/chat.js";
import express from "express"

const app = express.Router();

app.use(isAuthenticated);

app.post('/new', newGroupChat)

app.get('/my', getMyChats)

app.get('/my/groups', getMyGroups)

export default app;
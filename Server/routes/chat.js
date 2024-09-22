import { isAuthenticated } from "../middlewares/auth.js";
import { newGroupChat } from "../controllers/chat.js";
import express from "express"

const app = express.Router();

app.use(isAuthenticated);

app.get('/new', newGroupChat)

export default app;
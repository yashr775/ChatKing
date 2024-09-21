import express from 'express'
import { getMyProfile, login, logout, newUser, searchUser } from '../controllers/user.js';
import { singleAvatar } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';



const app = express.Router();

app.post("/new", singleAvatar, newUser)
app.post("/login", login)

app.use(isAuthenticated)
app.get("/me", getMyProfile)
app.get("/logout", logout)
app.get("/searchUser", searchUser)


export default app;
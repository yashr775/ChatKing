import express from 'express'
import { login } from '../controllers/user.js';


const app = express.Router();

app.get("/a", login)


export default app;
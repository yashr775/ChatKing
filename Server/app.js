import express from 'express'
import userRoute from './routes/user.js'
import chatRoute from './routes/chat.js'
import adminRoute from './routes/admin.js'
import { connectDB } from './utils/features.js';
import dotenv from 'dotenv'
import { errorMiddleware } from './middlewares/errors.js';
import cookieParser from 'cookie-parser';



dotenv.config({
    path: "./.env"
})


const mongoURI = process.env.MONGO_URI


const app = express();

const PORT = process.env.PORT || 3000
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "This is secret";

app.use(express.json());
app.use(cookieParser())



connectDB(mongoURI)


app.use("/user", userRoute)
app.use("/chat", chatRoute)
app.use("/admin", adminRoute)

app.get("/", (req, res) => {
    console.log("Hello world")
})


app.use(errorMiddleware)

app.listen(3000, () => {
    console.log(`App is listening on ${PORT}`)
})

export { adminSecretKey }
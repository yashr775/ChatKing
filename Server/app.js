import express, { urlencoded } from 'express'
import userRoute from './routes/user.js'
import { connectDB } from './utils/features.js';
import dotenv from 'dotenv'

dotenv.config({
    path: "./.env"
})


const mongoURI = process.env.MONGO_URI
const app = express();

const PORT = process.env.PORT || 3000

app.use(express.json());

connectDB(mongoURI)

app.use("/user", userRoute)

app.get("/", (req, res) => {
    console.log("Hello world")
})


app.listen(3000, () => {
    console.log(`App is listening on ${PORT}`)
})
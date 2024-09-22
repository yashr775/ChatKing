import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config({
    path: "../../.env"
})

const cookieOption = {
    maxAge: 15 * 24 * 60 * 60 * 1000, sameSite: "none", httpOnly: true, secure: true

}

const connectDB = (uri) => {
    mongoose
        .connect(uri, { dbName: "chatKing" })
        .then((data) => {
            console.log(`Connected to db ${data.connection.host}`);
        })
        .catch((err) => {
            throw err;
        });
};


const sendToken = (res, user, code, message) => {

    const jwtSecret = process.env.JWT_SECRET

    const token = jwt.sign({ _id: user._id }, jwtSecret)

    return res.status(code).cookie("chatKingToken", token, cookieOption).json({ success: true, message })
}

const emitEvent = (req, event, users, data) => {
    console.log("Emitting event " + event)
}

export { connectDB, sendToken, cookieOption, emitEvent }
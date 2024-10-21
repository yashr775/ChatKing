import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import { User } from "../models/user.js";
import { CHATKING_TOKEN } from "../constants/config.js";

dotenv.config({
    path: "../../.env"
})



const adminOnly = (req, res, next) => {
    const token = req.cookies["chatKing-admin-token"];

    if (!token)
        return next(new ErrorHandler("Only Admin can access this route", 401));

    const secretKey = jwt.verify(token, process.env.JWT_SECRET);

    const isMatched = secretKey === adminSecretKey;

    if (!isMatched)
        return next(new ErrorHandler("Only Admin can access this route", 401));

    next();
};

const isAuthenticated = async (req, res, next) => {

    const token = await req.cookies[CHATKING_TOKEN];
    if (!token)
        return next(new ErrorHandler("Please login to access the router", 401))

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decodedData._id;
    next();
}

const socketAuthenticator = async (err, socket, next) => {
    try {
        if (err) return next(err);

        const authToken = socket.request.cookies[CHATKING_TOKEN];

        if (!authToken)
            return next(new ErrorHandler("Please login to access this route", 401));

        const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

        const user = await User.findById(decodedData._id);

        if (!user)
            return next(new ErrorHandler("Please login to access this route", 401));

        socket.user = user;

        return next();
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("Please login to access this route", 401));
    }
}

export { isAuthenticated, adminOnly, socketAuthenticator }
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config({
    path: "../../.env"
})




const isAuthenticated = async (req, res, next) => {

    const token = await req.cookies["chatKingToken"];
    if (!token)
        return next(new ErrorHandler("Please login to access the router", 401))

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decodedData._id;
    next();
}

export { isAuthenticated }
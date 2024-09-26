import { TryCatch } from "../middlewares/errors.js";
import { User } from "../models/user.js";
import { cookieOption, sendToken } from "../utils/features.js";
import { compare } from "bcrypt";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";

const newUser = async (req, res) => {
    const { name, username, password, bio } = req.body;

    const avatar = {
        public_id: "kjhfgkjd",
        url: "fgdfgdfg",
    };

    const user = await User.create({
        name,
        username,
        password,
        bio,
        avatar,
    });
    sendToken(res, user, 201, "User created")
};

const login = TryCatch(async (req, res, next) => {

    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid credentials", 404))
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid credentials", 404))
    }
    return sendToken(res, user, 201, `Welcome back ${username}`)
});

const getMyProfile = TryCatch(async (req, res, next) => {

    const user = await User.findById(req.user);

    if (!user) return next(new ErrorHandler("User not found", 404));
    return res.status(200).json({
        success: true,
        user
    })

})

const logout = TryCatch(async (req, res) => {
    return res.status(200).cookie("chatKingToken", "", { ...cookieOption, maxAge: 0 }).json({ message: "Logged out successfully" })
})

const searchUser = TryCatch(async (req, res) => {
    const { name = "" } = req.query;

    const myChats = await Chat.find({ groupChat: false, members: req.user });


    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);


    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersFromMyChats },
        name: { $regex: name, $options: "i" },
    });

    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url,
    }));

    return res.status(200).json({
        success: true,
        users,
    });
})

export { login, newUser, getMyProfile, logout, searchUser };

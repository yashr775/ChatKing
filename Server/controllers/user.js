import { User } from "../models/user.js";
import { sendToken } from "../utils/features.js";

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

const login = (req, res) => {
    res.send("Hello World");
};

export { login, newUser };

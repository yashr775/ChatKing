import { ALERT, REFETCH_CHATS } from "../constants/event.js";
import { TryCatch } from "../middlewares/errors.js";
import { Chat } from "../models/chat.js"
import { emitEvent } from "../utils/features.js";


const newGroupChat = TryCatch(async (req, res, next) => {

    const { name, members } = req.user;

    const allMembers = [...members, req.user];

    await Chat.create({ name, groupChat: true, creater: req.user, members: allMembers });

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group chat`)
    emitEvent(req, REFETCH_CHATS, members)

    return res.status(201).json({
        success: "true",
        message: "Group chat created"
    })

})


export { newGroupChat }
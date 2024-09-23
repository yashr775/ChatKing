import { ALERT, REFETCH_CHATS } from "../constants/event.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/errors.js";
import { Chat } from "../models/chat.js"
import { emitEvent } from "../utils/features.js";


const newGroupChat = TryCatch(async (req, res, next) => {

    const { name, members } = req.body;

    const allMembers = [...members, req.user];

    await Chat.create({ name, groupChat: true, creator: req.user, members: allMembers });

    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group chat`)
    emitEvent(req, REFETCH_CHATS, members)

    return res.status(201).json({
        success: "true",
        message: "Group chat created"
    })

})


const getMyChats = TryCatch(async (req, res, next) => {

    const chats = await Chat.find({ members: req.user })
        .populate("members", "name avatar")

    const transformedChats = chats.map(({ _id, name, members, groupChat }) => {

        const otherMember = getOtherMember(members, req.user)
        return {
            _id,
            groupChat,
            avatar: groupChat ? members.slice(0, 3).map(({ avatar }) => [avatar.url]) : [otherMember.avatar.url],
            name: groupChat ? groupChat.name : otherMember.name,
            members: members.reduce((prev, curr) => {

                if (curr.id.toString() !== req.user.toString()) {
                    prev.push(curr._id);
                }
                return prev
            }, [])
        }
    })
    return res.status(200).json({
        success: "true",
        chats: transformedChats
    })

})


const getMyGroups = TryCatch(async (req, res, next) => {

    const chats = await Chat.find({
        members: req.user,
        groupChat: true,
        creator: req.user
    }).populate("members", "name avatar")

    const groups = chats.map(({ name, members, groupChat, _id }) => {
        return {
            _id,
            name,
            groupChat,
            avatar: members.slice(0, 3).map(({ avatar }) => avatar.url)

        }
    })

    return res.status(200).json({
        succes: true,
        groups
    })

})


export { newGroupChat, getMyChats, getMyGroups }
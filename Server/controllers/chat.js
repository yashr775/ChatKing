import { ALERT, REFETCH_CHATS } from "../constants/event.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/errors.js";
import { Chat } from "../models/chat.js"
import { User } from "../models/user.js";
import { emitEvent } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";


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



const addMembers = TryCatch(async (req, res, next) => {

    const { chatId, members } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.groupChat) return next(new ErrorHandler("NOt a group chat", 400));

    if (chat.creator.toString() !== req.user.toString())
        return next(new ErrorHandler("You are not allowed to add members", 403));

    if (members.length < 1 || !members) return next(new ErrorHandler("Please provide members", 400))

    const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

    const allNewMembers = await Promise.all(allNewMembersPromise);

    const uniqueMembers = allNewMembers
        .filter((i) => !chat.members.includes(i._id.toString()))
        .map((i) => i._id);

    chat.members.push(...uniqueMembers);

    if (chat.members.length > 100)
        return next(new ErrorHandler("Group members limit reached", 400));

    await chat.save();

    const allUsersName = allNewMembers.map((i) => i.name).join(", ");

    emitEvent(
        req,
        ALERT,
        chat.members,
        `${allUsersName} has been added in the group`
    );

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "Members added successfully",
    });
})


const removeMember = TryCatch(async (req, res, next) => {

    const { userId, chatId } = req.body

    const [chat, userThatWillBeRemoved] = await Promise.all([Chat.findById(chatId), User.findById(userId, name)])

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.groupChat) return next(new ErrorHandler("NOt a group chat", 400));

    if (chat.creator.toString() !== req.user.toString())
        return next(new ErrorHandler("You are not allowed to remove members", 403));

    if (chat.members.length <= 3)
        return next(new ErrorHandler("Group must have at least 3 members", 400));

    const allChatMembers = chat.members.map((i) => i.toString());

    chat.members = chat.members.filter(
        (member) => member.toString() !== userId.toString()
    );

    await chat.save();

    emitEvent(req, ALERT, chat.members, {
        message: `${userThatWillBeRemoved.name} has been removed from the group`,
        chatId,
    });

    emitEvent(req, REFETCH_CHATS, allChatMembers);

    return res.status(200).json({
        success: true,
        message: "Member removed successfully",
    });
}
)



export { newGroupChat, getMyChats, getMyGroups, addMembers, removeMember }
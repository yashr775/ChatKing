
export const sampleUsers = [
    {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "John Doe",
        _id: "1",
    },
    {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "John Boi",
        _id: "2",
    },
];

export const samepleChats = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Doe",
        _id: "1",
        groupChat: false,
        members: ["1", "2"],
    },

    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Boi",
        _id: "2",
        groupChat: true,
        members: ["1", "2"],
    },
];

export const sampleNotifications = [
    {
        sender: {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "John Doe",
        },
        _id: "1",
    },
    {
        sender: {
            avatar: "https://www.w3schools.com/howto/img_avatar.png",
            name: "John Boi",
        },
        _id: "2",
    },
];

export const sampleMessage = [
    {
        attachments: [],
        content: "gfddfggdfdfgdfgdf",
        _id: "sfnsdjkfsdnfkjsbnd",
        sender: {
            _id: "1",
            name: "Chaman ",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:41:30.630Z",
    },

    {
        attachments: [
            {
                public_id: "asdsad 2",
                url: "https://www.w3schools.com/howto/img_avatar.png",
            },
        ],
        content: "hjjhjhjhjhjhjhjhj",
        _id: "sfnsdjkfsdnfkdddjsbnd",
        sender: {
            _id: "sdfsdfsdf",
            name: "Chaman  2",
        },
        chat: "chatId",
        createdAt: "2024-02-12T10:41:30.630Z",
    },
];

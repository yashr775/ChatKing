/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Fragment, useCallback, useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { useRef } from "react";
import { grayColor } from "../constants/color";
import { InputBox } from "../components/styles/StyledComponents";
import {
    AttachFile as AttachFileIcon,
    Send as SendIcon,
} from "@mui/icons-material";
import { orange } from "../constants/color";
import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants/event";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hooks";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loader";

const Chat = ({ chatId }) => {
    const { user } = useSelector(state => state.auth)
    const containerRef = useRef(null);
    const socket = getSocket();
    const dispatch = useDispatch();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [IamTyping, setIamTyping] = useState(false);
    const [userTyping, setUserTyping] = useState(false);
    const typingTimeout = useRef(null);
    const bottomRef = useRef(null);
    const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

    const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
    const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
    const members = chatDetails?.data?.chat?.members;

    const errors = [
        { isError: chatDetails.isError, error: chatDetails.error },
        { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
    ];

    const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
        containerRef,
        oldMessagesChunk.data?.totalPages,
        page,
        setPage,
        oldMessagesChunk.data?.messages
    );

    const submitHandler = (e) => {
        e.preventDefault();
        const members = chatDetails?.data?.chat?.members;

        if (!message.trim) return;
        socket.emit(NEW_MESSAGE, { chatId, members, message });
        setMessage("");
    };

    const handleFileOpen = (e) => {
        dispatch(setIsFileMenu(true));
        setFileMenuAnchor(e.currentTarget);
    };

    const messageOnChange = (e) => {
        setMessage(e.target.value);
        if (!IamTyping) {
            socket.emit(START_TYPING, { members, chatId });
            setIamTyping(true);
        }
        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
            socket.emit(STOP_TYPING, { members, chatId });
            setIamTyping(false);
        }, [2000]);
    };

    const newMessagesListener = useCallback(
        (data) => {
            if (data.chatId !== chatId) return;

            setMessages((prev) => [...prev, data.message]);
        },
        [chatId]
    );

    const startTypingListener = useCallback(
        (data) => {
            if (data.chatId !== chatId) return;
            setUserTyping(true);
        },
        [chatId]
    );

    const stopTypingListener = useCallback(
        (data) => {
            if (data.chatId !== chatId) return;
            setUserTyping(false);
        },
        [chatId]
    );

    const alertListener = useCallback((content) => {
        const messageForAlert = {
            content,
            sender: {
                _id: Math.floor(Math.random() * 10 + 1).toString,
                name: user.name,
            },
            chat: chatId,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, messageForAlert])

    }, [chatId])

    const eventHandler = {
        [ALERT]: alertListener,
        [NEW_MESSAGE]: newMessagesListener,
        [START_TYPING]: startTypingListener,
        [STOP_TYPING]: stopTypingListener,
    };

    useSocketEvents(socket, eventHandler);

    useErrors(errors);

    const allMessages = [...oldMessages, ...messages];

    useEffect(() => {
        dispatch(removeNewMessagesAlert(chatId));
        return () => {
            setMessages([]);
            setMessage("");
            setOldMessages([]);
            setPage(1);
        };
    }, [chatId]);

    useEffect(() => {
        if (bottomRef.current)
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return chatDetails.isLoading ? (
        <Skeleton />
    ) : (
        <Fragment>
            {" "}
            <Stack
                ref={containerRef}
                boxSizing={"border-box"}
                padding={"1rem"}
                spacing={"1rem"}
                bgcolor={grayColor}
                height={"90%"}
                sx={{
                    overflowX: "hidden",
                    overflowY: "auto",
                }}
            >
                {allMessages.map((i) => (
                    <MessageComponent key={i._id} user={user} message={i} />
                ))}

                {userTyping && <TypingLoader />}
                <div ref={bottomRef} />
            </Stack>
            <form
                style={{
                    height: "10%",
                }}
                onSubmit={submitHandler}
            >
                <Stack
                    direction={"row"}
                    height={"100%"}
                    padding={"1rem"}
                    alignItems={"center"}
                    position={"relative"}
                >
                    <IconButton
                        sx={{
                            position: "absolute",
                            left: "1.5rem",
                            rotate: "30deg",
                        }}
                        onClick={handleFileOpen}
                    >
                        <AttachFileIcon />{" "}
                    </IconButton>

                    <InputBox
                        placeholder="Type Message Here..."
                        value={message}
                        onChange={messageOnChange}
                    />

                    <IconButton
                        type="submit"
                        sx={{
                            rotate: "-30deg",
                            bgcolor: orange,
                            color: "white",
                            marginLeft: "1rem",
                            padding: "0.5rem",
                            "&:hover": {
                                bgcolor: "error.dark",
                            },
                        }}
                    >
                        <SendIcon />{" "}
                    </IconButton>
                </Stack>
            </form>
            <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
        </Fragment>
    );
};

export default AppLayout(Chat);

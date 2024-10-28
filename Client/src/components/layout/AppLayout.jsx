/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */

import Header from "./Header";
import Title from "../shared/Title";
import { Drawer, Grid, Skeleton } from "@mui/material";
import ChatList from "../specific/ChatList";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { useErrors, useSocketEvents } from "../../hooks/hooks";
import { getSocket } from "../../socket";
import {
    NEW_MESSAGE,
    NEW_MESSAGE_ALERT,
    NEW_REQUEST,
    ONLINE_USERS,
    REFETCH_CHATS,
} from "../../constants/event";
import {
    incrementNotification,
    setNewMessagesAlert,
} from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/features";
import {
    setIsDeleteMenu,
    setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
const AppLayout = (WrappedComponent) => {
    return (props) => {
        const [onlineUsers, setOnlineUsers] = useState([]);

        const navigate = useNavigate();

        const socket = getSocket();

        const params = useParams();
        const deleteMenuAnchor = useRef(null);
        const chatId = params.chatId;
        const { isMobile } = useSelector((state) => state.misc);
        const { user } = useSelector((state) => state.auth);
        const { newMessagesAlert } = useSelector((state) => state.chat);
        const dispatch = useDispatch();

        const { isLoading, data, error, isError, refetch } = useMyChatsQuery("");
        useErrors([{ error, isError }]);

        const handleDeleteChat = (e, chatId, groupChat) => {
            e.preventDefault();
            dispatch(setIsDeleteMenu(true));
            dispatch(setSelectedDeleteChat({ chatId, groupChat }));
            deleteMenuAnchor.current = e.currentTarget;
        };

        const handleMobileClose = () => {
            dispatch(isMobile(false));
        };

        const newMessageAlertListener = useCallback(
            (data) => {
                if (data.chatId === chatId) return;
                dispatch(setNewMessagesAlert(data));
            },
            [chatId, dispatch]
        );

        const newRequestListener = useCallback(() => {
            dispatch(incrementNotification());
        }, [dispatch]);

        const refetchListener = useCallback(() => {
            refetch();
            navigate("/");
        }, [refetch, navigate]);

        const onlineUsersListener = useCallback((data) => {
            setOnlineUsers(data)
        }, []);

        const eventHandler = {
            [NEW_MESSAGE]: newMessageAlertListener,
            [NEW_REQUEST]: newRequestListener,
            [REFETCH_CHATS]: refetchListener,
            [ONLINE_USERS]: onlineUsersListener,
        };

        useEffect(() => {
            getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
        }, [newMessagesAlert]);

        useSocketEvents(socket, eventHandler);

        return (
            <>
                <Title title={"Chat App"} description="jklffd" />
                <Header />
                <DeleteChatMenu
                    dispatch={dispatch}
                    deleteMenuAnchor={deleteMenuAnchor}
                />
                {isLoading ? (
                    <Skeleton />
                ) : (
                    <Drawer open={isMobile} onClose={handleMobileClose}>
                        <ChatList
                            w="70vw"
                            chats={data?.chats}
                            chatId={chatId}
                            handleDeleteChat={handleDeleteChat}
                            onlineUsers={onlineUsers}
                            newMessagesAlert={newMessagesAlert}
                        />
                    </Drawer>
                )}

                <Grid container height={"calc(100vh - 4rem)"} sx={{ width: "100%" }}>
                    <Grid
                        item
                        sm={4}
                        md={3}
                        lg={3}
                        sx={{
                            display: { xs: "none", sm: "block" },
                        }}
                        height={"100%"}
                    >
                        {isLoading ? (
                            <Skeleton />
                        ) : (
                            <ChatList
                                chats={data?.chats}
                                chatId={chatId}
                                handleDeleteChat={handleDeleteChat}
                                onlineUsers={onlineUsers}
                                user={user}
                                newMessagesAlert={newMessagesAlert}
                                onlineUSers={onlineUsers}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} sm={8} md={5} lg={5} height={"100%"}>
                        {" "}
                        <WrappedComponent {...props} chatId={chatId} />
                    </Grid>
                    <Grid
                        item
                        md={4}
                        lg={4}
                        height={"100%"}
                        sx={{
                            display: { xs: "none", md: "block" },
                            padding: "2rem",
                            bgcolor: "rgba(0,0,0,0.85)",
                        }}
                    >
                        <Profile user={user} />
                    </Grid>
                </Grid>
            </>
        );
    };
};

export default AppLayout;

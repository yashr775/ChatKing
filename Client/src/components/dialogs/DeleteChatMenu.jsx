/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Menu, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import {
    Delete as DeleteIcon,
    ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hooks";
import {
    useDeleteChatMutation,
    useLeaveGroupMutation,
} from "../../redux/api/api";
import { useEffect } from "react";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
    const { isDeleteMenu, selectedDeleteChat } = useSelector(
        (state) => state.misc
    );

    const { chatId } = selectedDeleteChat

    const navigate = useNavigate();

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteMenuAnchor.current = null;
    };

    const [deleteChat, _, deleteChatData] = useAsyncMutation(
        useDeleteChatMutation
    );

    const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
        useLeaveGroupMutation
    );

    const isGroup = selectedDeleteChat.groupChat;
    const deleteChatHandler = () => {
        closeHandler();
        deleteChat("Delete Chat...", { chatId });
    };

    const leaveGroupHandler = () => {
        closeHandler();
        leaveGroup("Leaving Group...", { chatId });
    };

    useEffect(() => {
        if (deleteChatData || leaveGroupData) navigate("/");
    }, [deleteChatData, navigate, leaveGroupData]);

    return (
        <Menu
            open={isDeleteMenu}
            onClose={closeHandler}
            anchorEl={deleteMenuAnchor.current}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "center",
            }}
        >
            <Stack
                sx={{
                    width: "10rem",
                    padding: "0.5rem",
                    cursor: "pointer",
                }}
                direction={"row"}
                alignItems={"center"}
                spacing={"0.5rem"}
                onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
            >
                {isGroup ? (
                    <>
                        <ExitToAppIcon />
                        <Typography>Leave Group</Typography>
                    </>
                ) : (
                    <>
                        <DeleteIcon />
                        <Typography>Delete Chat</Typography>
                    </>
                )}
            </Stack>
        </Menu>
    );
};

export default DeleteChatMenu;

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Fragment, useState } from "react";
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
import { sampleMessage } from "../constants/sampleData";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import { NEW_MESSAGE } from "../constants/event";
import { useChatDetailsQuery } from "../redux/api/api";

const user = {
    _id: "1",
    name: "abhi10"
}

const Chat = ({ chatId, members, }) => {
    const containerRef = useRef(null);
    const socket = getSocket();

    const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId })

    const [message, setMessage] = useState("")

    const fileMenuRef = useRef(null);

    const submitHandler = (e) => {
        e.preventDefault();
        const members = chatDetails?.data?.chat?.members

        if (!message.trim) return;
        socket.emit(NEW_MESSAGE, { chatId, members, message })
        setMessage("")
    };

    return (chatDetails.isLoading ? <Skeleton /> :
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
                {sampleMessage.map((message) => (<MessageComponent key={user.id} user={user} message={message} />))}
            </Stack>{" "}
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
                    <IconButton sx={{
                        position: "absolute",
                        left: "1.5rem",
                        rotate: "30deg",
                    }}

                        ref={fileMenuRef}
                    >
                        <AttachFileIcon />{" "}
                    </IconButton>


                    <InputBox placeholder="Type Message Here..." value={message} onChange={(e) => setMessage(e.target.value)} />

                    <IconButton type="submit" sx={{
                        rotate: "-30deg",
                        bgcolor: orange,
                        color: "white",
                        marginLeft: "1rem",
                        padding: "0.5rem",
                        "&:hover": {
                            bgcolor: "error.dark",
                        },
                    }}>
                        <SendIcon />{" "}
                    </IconButton>
                </Stack>
            </form>
            <FileMenu />
        </Fragment>
    );
};

export default AppLayout(Chat);

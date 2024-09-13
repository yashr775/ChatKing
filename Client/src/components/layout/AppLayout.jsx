/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */

import Header from "./Header";
import Title from "../shared/Title";
import { Grid } from "@mui/material";
import ChatList from "../specific/ChatList";
import { samepleChats } from "../../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useState } from "react";
const AppLayout = (WrappedComponent) => {
    return (props) => {
        const params = useParams();
        const chatId = params.chatId;

        const handleDeleteChat = (e, _id, groupChat) => {
            e.preventDefault();
            console.log(_id + " " + groupChat)
        }
        const [onlineUsers, setOnlineUsers] = useState([]);

        return (
            <>
                <Title title={"Chat App"} description="jklffd" />
                <Header />
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
                        <ChatList
                            chats={samepleChats}
                            chatId={chatId}
                            handleDeleteChat={handleDeleteChat}
                            onlineUsers={onlineUsers}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8} md={5} lg={5} height={"100%"}>
                        {" "}
                        <WrappedComponent {...props} />
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
                        <Profile />
                    </Grid>
                </Grid>
            </>
        );
    };
};

export default AppLayout;

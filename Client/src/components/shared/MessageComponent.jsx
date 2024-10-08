/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

import { memo } from "react";
import { Typography, Box } from "@mui/material";
import { lightBlue } from "../../constants/color"
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";

const MessageComponent = ({ message, user }) => {
    const { sender, attachments = [], content, createdAt } = message;

    const sameSender = user?._id === sender?._id;
    const timeAgo = moment(createdAt).fromNow()

    return (
        <div
            style={{
                alignSelf: sameSender ? "flex-end" : "flex-start",
                backgroundColor: "white",
                color: "black",
                borderRadius: "5px",
                padding: "0.5rem",
                width: "fit-content",
            }}
        >
            {!sameSender && (
                <Typography color={lightBlue} fontWeight={"600"} variant="caption">
                    {sender.name}
                </Typography>
            )}
            {content && <Typography>{content}</Typography>}
            {attachments.length > 0 && attachments.map((attachment, index) => {
                const url = attachment.url;
                const file = fileFormat(url);

                return <Box key={index}>
                    <a href={url} target="_blank" download style={{ color: "black" }}>{RenderAttachment(file, url)}</a>
                </Box>
            })}
            <Typography variant="caption" color={"text.secondry"}>{timeAgo}</Typography>
        </div>
    );
};

export default memo(MessageComponent);

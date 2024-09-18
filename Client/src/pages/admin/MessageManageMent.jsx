/* eslint-disable no-unused-vars */
import { Stack, Avatar, Box } from "@mui/material";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import AdminLayout from "../../components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { fileFormat, transformImage } from "../../lib/features";
import RenderAttachment from "../../components/shared/RenderAttachment";
import { dashboardData as data } from "../../constants/sampleData";
import moment from "moment"




const columns = [
    {
        field: "id",
        headerName: "ID",
        headerClassName: "table-header",
        width: 200,
    },
    {
        field: "attachments",
        headerName: "Attachments",
        headerClassName: "table-header",
        width: 200,
        renderCell: (params) => {
            const { attachments } = params.row;

            return attachments?.length > 0
                ? attachments.map((i) => {
                    const url = i.url;
                    const file = fileFormat(url);

                    return (
                        <Box key={i.url}>
                            <a

                                href={url}
                                download
                                target="_blank"
                                style={{
                                    color: "black",
                                }}
                            >
                                {RenderAttachment(file, url)}
                            </a>
                        </Box>
                    );
                })
                : "No Attachments";
        },
    },

    {
        field: "content",
        headerName: "Content",
        headerClassName: "table-header",
        width: 400,
    },
    {
        field: "sender",
        headerName: "Sent By",
        headerClassName: "table-header",
        width: 200,
        renderCell: (params) => (
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
                <span>{params.row.sender.name}</span>
            </Stack>
        ),
    },
    {
        field: "chat",
        headerName: "Chat",
        headerClassName: "table-header",
        width: 220,
    },
    {
        field: "groupChat",
        headerName: "Group Chat",
        headerClassName: "table-header",
        width: 100,
    },
    {
        field: "createdAt",
        headerName: "Time",
        headerClassName: "table-header",
        width: 250,
    },
];


const MessageManagement = () => {

    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (data) {
            setRows(
                data.messages.map((i) => ({
                    ...i,
                    id: i._id,
                    sender: {
                        name: i.sender.name,
                        avatar: transformImage(i.sender.avatar, 50),
                    },
                    createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
                }))
            );
        }
    }, [data]);

    return (
        <AdminLayout>
            <Table
                heading={"All Messages"}
                columns={columns}
                rows={rows}
                rowHeight={200}
            />
        </AdminLayout>
    )
}

export default MessageManagement
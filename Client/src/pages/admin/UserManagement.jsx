/* eslint-disable no-unused-vars */
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar } from "@mui/material";
import { useState, useEffect } from "react";
import { transformImage } from "../../lib/features";
import { dashboardData as data } from "../../constants/sampleData";

const columns = [
    {
        field: "id",
        headerName: "ID",
        headerClassName: "table-header",
        width: 200,
    },
    {
        field: "avatar",
        headerName: "Avatar",
        headerClassName: "table-header",
        width: 150,
        renderCell: (params) => (
            <Avatar alt={params.row.name} src={params.row.avatar} />
        ),
    },

    {
        field: "name",
        headerName: "Name",
        headerClassName: "table-header",
        width: 200,
    },
    {
        field: "username",
        headerName: "Username",
        headerClassName: "table-header",
        width: 200,
    },
    {
        field: "friends",
        headerName: "Friends",
        headerClassName: "table-header",
        width: 150,
    },
    {
        field: "groups",
        headerName: "Groups",
        headerClassName: "table-header",
        width: 200,
    },
];


const UserManagement = () => {

    const [rows, setRows] = useState([])


    useEffect(() => {
        if (data) {
            setRows(
                data.users.map((i) => ({
                    ...i,
                    id: i._id,
                    avatar: transformImage(i.avatar, 50),
                }))
            );
        }
    }, []);

    return (
        <AdminLayout>
            <Table heading={"All Users"} rows={rows} columns={columns} />
        </AdminLayout>
    );
};

export default UserManagement;

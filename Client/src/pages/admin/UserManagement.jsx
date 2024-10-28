/* eslint-disable no-unused-vars */
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar, Skeleton } from "@mui/material";
import { useState, useEffect } from "react";
import { transformImage } from "../../lib/features";

import { useFetchData } from "6pp";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hooks";

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
    const [rows, setRows] = useState([]);
    const { loading, data, error } = useFetchData(
        `${server}/api/v1/admin/users`,
        "dashboard-users"
    );

    useErrors([{ isError: error, error }]);

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
    }, [data]);

    return (
        <AdminLayout>
            {loading ? (
                <Skeleton height={"100vh"} />
            ) : (
                <Table heading={"All Users"} rows={rows} columns={columns} />
            )}
        </AdminLayout>
    );
};

export default UserManagement;

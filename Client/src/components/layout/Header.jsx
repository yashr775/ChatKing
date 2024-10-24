/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
    AppBar,
    Backdrop,
    Badge,
    Box,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import { orange } from "../../constants/color";
import {
    Add as AddIcon,
    Menu as MenuIcon,
    Search as SearchIcon,
    Group as GroupIcon,
    Logout as LogoutIcon,
    Notifications as NotificationsIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom"
import { useState, Suspense, lazy } from "react";
import { server } from "../../constants/config";
import axios from "axios";
import { userNotExists } from "../../redux/reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Header = () => {
    const navigate = useNavigate();
    const { isSearch, isNotification } = useSelector(state => state.misc)
    const { notificationCount } = useSelector(state => state.chat)
    const { isNewGroup } = useSelector(state => state.misc)

    const dispatch = useDispatch();


    const handleMobile = (e) => {
        e.preventDefault()
        dispatch(setIsMobile(prev => !prev))
    }

    const openSearch = (e) => {
        e.preventDefault()

        dispatch(setIsSearch(true))

    }

    const openNewGroup = (e) => {
        e.preventDefault()
        dispatch(setIsNewGroup(true))
    }

    const openNotification = (e) => {
        e.preventDefault()
        dispatch(setIsNotification(true))
        dispatch(resetNotificationCount())
    }

    const navigateToGroup = (e) => {
        e.preventDefault()
        navigate("/groups");
    }
    const logoutHandler = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.get(`${server}/api/v1/user/logout`, {
                withCredentials: true,
            });
            dispatch(userNotExists());
            toast.success(data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }


    }


    return (
        <>
            <Box sx={{ flexGrow: 1 }} height={"4rem"}>
                <AppBar
                    position="static"
                    sx={{
                        bgcolor: orange,
                    }}
                >
                    <Toolbar>
                        <Typography
                            variant="h6"
                            sx={{
                                display: { xs: "none", sm: "block" },
                            }}
                        >
                            ChatKing
                        </Typography>
                        <Box
                            sx={{
                                display: { xs: "block", sm: "none" },
                            }}
                        >
                            <IconButton color="inherit" onClick={handleMobile}>
                                <MenuIcon />
                            </IconButton>
                        </Box>
                        <Box
                            sx={{
                                flexGrow: 1,
                            }}
                        />
                        <Box>
                            <IconBtn
                                title={"Search"}
                                icon={<SearchIcon />}
                                onClick={openSearch}
                            />

                            <IconBtn
                                title={"New Group"}
                                icon={<AddIcon />}
                                onClick={openNewGroup}
                            />

                            <IconBtn
                                title={"Manage Groups"}
                                icon={<GroupIcon />}
                                onClick={navigateToGroup}
                            />

                            <IconBtn
                                title={"Notifications"}
                                icon={<NotificationsIcon />}
                                onClick={openNotification}
                                value={notificationCount}
                            />

                            <IconBtn
                                title={"Logout"}
                                icon={<LogoutIcon />}
                                onClick={logoutHandler}
                            />
                        </Box>
                    </Toolbar>

                </AppBar>
            </Box>
            {isSearch && (
                <Suspense fallback={<Backdrop open />}>
                    <SearchDialog />
                </Suspense>
            )}

            {isNotification && (
                <Suspense fallback={<Backdrop open />}>
                    <NotifcationDialog />
                </Suspense>
            )}

            {isNewGroup && (
                <Suspense fallback={<Backdrop open />}>
                    <NewGroupDialog />
                </Suspense>
            )}
        </>
    )
}

const IconBtn = ({ title, icon, onClick, value }) => {
    return (
        <Tooltip title={title}>
            <IconButton color="inherit" size="large" onClick={onClick}>
                {value ? (
                    <Badge badgeContent={value} color="error">
                        {icon}
                    </Badge>
                ) : (
                    icon
                )}
            </IconButton>
        </Tooltip>
    );
};

export default Header
/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import {
    Grid,
    Box,
    IconButton,
    Tooltip,
    Drawer,
    Stack,
    Typography,
    TextField,
    Button,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import {
    Menu as MenuIcon,
    KeyboardBackspace as KeyboardBackspaceIcon,
    Edit as EditIcon,
    Done as DoneIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { matBlack, bgGradient } from "../constants/color";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, memo, useEffect, Suspense, lazy } from "react";
import AvatarCard from "../components/shared/AvatarCard";
import { Link } from "../components/styles/StyledComponents";
import UserItem from "../components/shared/UserItem";
import {
    useAddGroupMembersMutation,
    useChatDetailsQuery,
    useDeleteChatMutation,
    useMyGroupsQuery,
    useRemoveGroupMemberMutation,
    useRenameGroupMutation,
} from "../redux/api/api";
import { useAsyncMutation, useErrors } from "../hooks/hooks";
import { LayoutLoader } from "../components/layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
    import("../components/dialogs/ConfirmDeleteDialog")
);

const AddMemberDialog = lazy(() =>
    import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
    const chatId = useSearchParams()[0].get("group");

    const [isMobileMenuOpen, setISMobileMenuOpen] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    const [groupName, setGroupName] = useState("");

    const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

    const [members, setMembers] = useState([]);

    const myGroups = useMyGroupsQuery("");

    const { isAddMember } = useSelector((state) => state.misc);

    const dispatch = useDispatch();
    const groupDetails = useChatDetailsQuery(
        { chatId, populate: true },
        { skip: !chatId }
    );

    const [updateGroup, isLoadingGroupName] = useAsyncMutation(
        useRenameGroupMutation
    );

    const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
        useRemoveGroupMemberMutation
    );

    const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
        useDeleteChatMutation
    );

    const [addMembers, isLoadingAddMember] = useAsyncMutation(
        useAddGroupMembersMutation
    );

    const errors = [
        { isError: myGroups.isError, error: myGroups.error },
        {
            isError: groupDetails.isError,
            error: groupDetails.error,
        },
    ];

    useEffect(() => {
        const groupData = groupDetails.data;
        if (groupData) {
            setGroupName(groupData.chat.name);
            setGroupNameUpdatedValue(groupData.chat.name);
            setMembers(groupData.chat.members);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setMembers([]);
            setIsEdit(false);
        };
    }, [groupDetails.data]);

    const navigate = useNavigate();

    const removeMemberHandler = (userId) => {
        removeMember("Removing Member...", { chatId, userId });
    };

    const handleMobile = () => {
        setISMobileMenuOpen((prev) => !prev);
    };

    const deleteHandler = () => {
        deleteGroup("Deleting Group ... ", { chatId })
        closeConfirmDeleteHandler();
        navigate("/groups")
    };

    const openConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(true);
    };

    const closeConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(false);
    };

    const navigateBack = () => {
        navigate("/");
    };

    const handleMobileClose = () => {
        setISMobileMenuOpen(false);
    };

    const updateGroupNameHandler = () => {
        setIsEdit(false);
        updateGroup("Updating group name ...", {
            chatId,
            name: groupNameUpdatedValue,
        });
    };

    const openAddMemberHandler = () => {
        dispatch(setIsAddMember(true));
    };

    const IconBtns = (
        <>
            <Box
                sx={{
                    display: {
                        xs: "block",
                        sm: "none",
                        position: "fixed",
                        right: "1rem",
                        top: "1rem",
                    },
                }}
            >
                <IconButton onClick={handleMobile}>
                    <MenuIcon />
                </IconButton>
            </Box>

            <Tooltip title="back">
                <IconButton
                    sx={{
                        position: "absolute",
                        top: "2rem",
                        left: "2rem",
                        bgcolor: matBlack,
                        color: "white",
                        ":hover": {
                            bgcolor: "rgba(0,0,0,0.7)",
                        },
                    }}
                    onClick={navigateBack}
                >
                    <KeyboardBackspaceIcon />
                </IconButton>
            </Tooltip>
        </>
    );

    const GroupName = (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            spacing={"1rem"}
            padding={"3rem"}
        >
            {isEdit ? (
                <>
                    <TextField
                        value={groupNameUpdatedValue}
                        onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
                    />
                    <IconButton
                        onClick={updateGroupNameHandler}
                        disabled={isLoadingGroupName}
                    >
                        <DoneIcon />
                    </IconButton>
                </>
            ) : (
                <>
                    <Typography variant="h4">{groupName}</Typography>
                    <IconButton
                        disabled={isLoadingGroupName}
                        onClick={() => setIsEdit(true)}
                    >
                        <EditIcon />{" "}
                    </IconButton>
                </>
            )}
        </Stack>
    );

    const ButtonGroup = (
        <Stack
            direction={{
                xs: "column-reverse",
                sm: "row",
            }}
            spacing={"1rem"}
            p={{
                xs: "0",
                sm: "1rem",
                md: "1rem 4rem",
            }}
        >
            <Button
                size="large"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={openConfirmDeleteHandler}
            >
                Delete Group
            </Button>
            <Button
                size="large"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openAddMemberHandler}
            >
                Add Member
            </Button>
        </Stack>
    );

    return myGroups.isLoading ? (
        <LayoutLoader />
    ) : (
        <Grid container height={"100vh"}>
            <Grid
                item
                sx={{
                    display: {
                        xs: "none",
                        sm: "block",
                    },
                }}
                sm={4}
                bgcolor={"bisque"}
            >
                <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
            </Grid>
            <Grid
                item
                xs={12}
                sm={8}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    padding: "1rem 3rem",
                }}
            >
                {IconBtns}
                {groupName && (
                    <>
                        {GroupName}
                        <Typography
                            margin={"2rem"}
                            alignSelf={"flex-start"}
                            variant="body1"
                        >
                            Members
                        </Typography>
                        <Stack
                            maxWidth={"45rem"}
                            width={"100%"}
                            boxSizing={"border-box"}
                            padding={{
                                sm: "1rem",
                                xs: "0",
                                md: "1rem 4rem",
                            }}
                            spacing={"2rem"}
                            height={"50vh"}
                            overflow={"auto"}
                        >
                            {/* Members */}

                            {isLoadingRemoveMember ? <CircularProgress /> : members.map((i) => (
                                <UserItem
                                    key={i._id}
                                    user={i}
                                    isAdded
                                    styling={{
                                        boxShadow: "0 0 0.5rem  rgba(0,0,0,0.2)",
                                        padding: "1rem 2rem",
                                        borderRadius: "1rem",
                                    }}
                                    handler={removeMemberHandler}
                                />
                            ))}
                        </Stack>
                        {ButtonGroup}
                    </>
                )}
            </Grid>
            {isAddMember && (
                <Suspense fallback=<Backdrop open />>
                    <AddMemberDialog chatId={chatId} />
                </Suspense>
            )}
            {confirmDeleteDialog && (
                <Suspense fallback=<Backdrop open />>
                    <ConfirmDeleteDialog
                        open={confirmDeleteDialog}
                        close={closeConfirmDeleteHandler}
                        deleteHandler={deleteHandler}
                    />
                </Suspense>
            )}
            <Drawer
                sx={{
                    display: {
                        xs: "block",
                        sm: "none",
                    },
                }}
                open={isMobileMenuOpen}
                onClose={handleMobileClose}
            >
                <GroupsList
                    w={"50vw"}
                    myGroups={myGroups?.data?.groups}
                    chatId={myGroups._id}
                />
            </Drawer>
        </Grid>
    );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
    return (
        <Stack
            width={w}
            sx={{
                backgroundImage: bgGradient,
                height: "100vh",
                overflow: "auto",
            }}
        >
            {myGroups.length > 0 ? (
                myGroups.map((group) => (
                    <GroupListItem group={group} chatId={chatId} key={group._id} />
                ))
            ) : (
                <Typography textAlign={"center"} padding="1rem">
                    No groups
                </Typography>
            )}
        </Stack>
    );
};

const GroupListItem = memo(({ group, chatId }) => {
    const { name, avatar, _id } = group;
    // const avatarArray = Array.isArray(avatar) ? avatar : [avatar];

    return (
        <Link
            to={`?group=${_id}`}
            onClick={(e) => {
                if (chatId === _id) e.preventDefault();
            }}
        >
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                <AvatarCard avatar={avatar} />
                <Typography>{name}</Typography>
            </Stack>
        </Link>
    );
});

export default Groups;

/* eslint-disable react/prop-types */
import {
    Avatar,
    Dialog,
    DialogTitle,
    Stack,
    Typography,
    Button,
    ListItem,
    Skeleton,
} from "@mui/material";
import { memo } from "react";
import {
    useAcceptFriendRequestMutation,
    useGetNotificationsQuery,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";

const Notifications = () => {
    const { isNotification } = useSelector((state) => state.misc);

    const dispatch = useDispatch();

    const { isLoading, data, isError, error } = useGetNotificationsQuery();

    const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

    useErrors([{ error, isError }]);

    const friendRequestHandler = async ({ _id, accept }) => {
        dispatch(setIsNotification(false));
        await acceptRequest("Accepting...", { requestId: _id, accept });
    };

    const closeHandler = () => {
        dispatch(setIsNotification(false));
    };

    return (
        <Dialog open={isNotification} onClose={closeHandler}>
            <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
                {" "}
                <DialogTitle>Notifications</DialogTitle>
                {isLoading ? (
                    <Skeleton />
                ) : (
                    <>
                        {data?.allRequests.length > 0 ? (
                            data?.allRequests?.map(({ sender, _id }) => (
                                <NotificationItem
                                    sender={sender}
                                    _id={_id}
                                    handler={friendRequestHandler}
                                    key={_id}
                                />
                            ))
                        ) : (
                            <Typography textAlign={"center"}>0 notifications</Typography>
                        )}
                    </>
                )}
            </Stack>
        </Dialog>
    );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
    const { name } = sender;
    return (
        <ListItem>
            <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={"1rem"}
                width={"100%"}
            >
                <Avatar />

                <Typography
                    variant="body1"
                    sx={{
                        flexGrow: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",
                    }}
                >
                    {`${name} sent you a friend request.`}
                </Typography>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                >
                    <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
                    <Button color="error" onClick={() => handler({ _id, accept: false })}>
                        Reject
                    </Button>
                </Stack>
            </Stack>
        </ListItem>
    );
});

NotificationItem.displayName = "NotificationItem";

export default Notifications;

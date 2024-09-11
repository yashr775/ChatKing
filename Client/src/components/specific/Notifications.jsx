/* eslint-disable react/prop-types */
import { Avatar, Dialog, DialogTitle, Stack, Typography, Button, ListItem } from "@mui/material";
import { sampleNotifications } from "../../constants/sampleData";
import { memo } from "react"

const Notifications = () => {

    const friendRequestHandler = ({ _id, accept }) => { console.log(_id + " " + accept) }

    return (
        <Dialog open>
            <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
                {" "}
                <DialogTitle>Notifications</DialogTitle>
                <>
                    {sampleNotifications.length > 0 ? (
                        sampleNotifications.map(({ sender, _id }) => (
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

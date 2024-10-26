/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, Stack, Typography, Button, Skeleton } from "@mui/material";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from "../../redux/api/api";

const AddMemberDialog = ({ chatId }) => {
    const dispatch = useDispatch();

    const { isAddMember } = useSelector((state) => state.misc);

    const [addMembers, isLoadingAddMembers] = useAsyncMutation(
        useAddGroupMembersMutation
    );

    const { isLoading, error, isError, data } = useAvailableFriendsQuery(chatId);

    const [selectedMembers, setSelectedMembers] = useState([]);
    const [members, setMembers] = useState(sampleUsers);

    const addFriendHandler = (id) => {
        console.log(id + " " + chatId);
    };

    const closeHandler = () => {
        dispatch(setIsAddMember(false));
    };

    const addMemberSubmitHandler = () => {
        addMembers("AddingMembers ...", { members: selectedMembers, chatId })
        closeHandler();
    };

    const selectMemberHandler = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id)
                ? prev.filter((currElement) => currElement !== id)
                : [...prev, id]
        );
    };

    useErrors([{ isError, error }]);

    return (
        <Dialog open={isAddMember} onClose={closeHandler}>
            <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
                <DialogTitle textAlign={"center"}> Add Member</DialogTitle>
                <Stack spacing={"1rem"}>
                    {isLoading ? <Skeleton /> : data?.friends?.length > 0 ? (
                        data?.friends?.map((i) => (
                            <UserItem
                                key={i.id}
                                user={i}
                                handler={selectMemberHandler}
                                isAdded={selectedMembers.includes(i._id)}
                            />
                        ))
                    ) : (
                        <Typography textAlign={"center"}>No Friends</Typography>
                    )}
                </Stack>

                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-evenly"}
                >
                    <Button color="error" onClick={closeHandler}>
                        Cancel
                    </Button>
                    <Button
                        onClick={addMemberSubmitHandler}
                        variant="contained"
                        disabled={isLoadingAddMembers}
                    >
                        Submit Changes
                    </Button>
                </Stack>
            </Stack>
        </Dialog>
    );
};

export default AddMemberDialog;

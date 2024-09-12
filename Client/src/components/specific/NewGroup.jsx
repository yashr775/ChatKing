/* eslint-disable no-unused-vars */
import { Dialog, DialogTitle, Stack, Typography, TextField, Skeleton, Button } from "@mui/material";
import UserItem from "../shared/UserItem";
import { sampleUsers } from "../../constants/sampleData";
import { useInputValidation } from "6pp";
import { useState } from "react"

const NewGroup = () => {

    const selectMemberHandler = (id) => {
        console.log(id)
    }
    const [selectedMembers, setSelectedMembers] = useState([]);
    const groupName = useInputValidation("");
    const submitHandler = () => {

    }

    const closeHandler = () => {

    }

    const isLoadingNewGroup = true
    const isLoading = false
    return (
        <Dialog open={true}>
            <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
                <DialogTitle textAlign={"center"} variant="h4">
                    New Group
                </DialogTitle>

                <TextField
                    label="Group Name"
                    value={groupName.value}
                    onChange={groupName.changeHandler}
                />

                <Typography variant="body1">Members</Typography>

                <Stack>
                    {isLoading ? (
                        <Skeleton />
                    ) : (
                        sampleUsers.map((i) => (
                            <UserItem
                                user={i}
                                key={i._id}
                                handler={selectMemberHandler}
                                isAdded={selectedMembers.includes(i._id)}
                            />
                        ))
                    )}
                </Stack>

                <Stack direction={"row"} justifyContent={"space-evenly"}>
                    <Button
                        variant="text"
                        color="error"
                        size="large"
                        onClick={closeHandler}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={submitHandler}
                        disabled={isLoadingNewGroup}
                    >
                        Create
                    </Button>
                </Stack>
            </Stack>
        </Dialog>
    );
};


export default NewGroup
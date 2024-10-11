/* eslint-disable no-unused-vars */
import { useInputValidation } from "6pp";
import { Dialog, Stack, DialogTitle, TextField, InputAdornment, List } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";



const Search = () => {

    const { isSearch } = useSelector((state) => state.misc)
    const dispatch = useDispatch();

    const [users, setUsers] = useState(sampleUsers)

    const search = useInputValidation("")

    const addFriendHandler = (id) => {
        console.log(id)
    }

    let isLoadingSendFriendRequest = false;

    const searchCloseHandler = () => {
        dispatch(setIsSearch(false));
    }


    return (
        <Dialog open={isSearch} onClose={searchCloseHandler}>
            <Stack p={"2rem"} direction={"column"} width={"25rem"}>
                {" "}
                <DialogTitle textAlign={"center"}>Find People</DialogTitle>
                <TextField
                    label=""
                    value={search.value}
                    onChange={search.changeHandler}
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <List> {users.map((i) => (
                    <UserItem
                        user={i}
                        key={i._id}
                        handler={addFriendHandler}
                        handlerIsLoading={isLoadingSendFriendRequest}
                    />
                ))}</List>
            </Stack>
        </Dialog>
    );
};

export default Search;

/* eslint-disable no-unused-vars */
import { useInputValidation } from "6pp";
import {
    Dialog,
    Stack,
    DialogTitle,
    TextField,
    InputAdornment,
    List,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
import {
    useLazySearchUserQuery,
    useSendFriendRequestMutation,
} from "../../redux/api/api";
import toast from "react-hot-toast";
import { useAsyncMutation } from "../../hooks/hooks";

const Search = () => {
    const { isSearch } = useSelector((state) => state.misc);
    const dispatch = useDispatch();

    const [users, setUsers] = useState([]);
    const [searchUser] = useLazySearchUserQuery();
    const [sendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation());

    const search = useInputValidation("");

    const addFriendHandler = async (id) => {
        console.log(id);
        try {

            const res = await sendFriendRequest({ userId: id });

            if (res.data) {
                toast.success("Request sent successfully");
                console.log(res.data);
            } else {
                console.log(res.error.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    let isLoadingSendFriendRequest = false;

    const searchCloseHandler = () => {
        dispatch(setIsSearch(false));
    };

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            searchUser(search.value)
                .then(({ data }) => setUsers(data.users))
                .catch((e) => console.log(e));
        }, 1000);

        return () => {
            clearTimeout(timeOutId);
        };
    }, [search.value]);

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
                <List>
                    {" "}
                    {users.map((i) => (
                        <UserItem
                            user={i}
                            key={i._id}
                            handler={addFriendHandler}
                            handlerIsLoading={isLoadingSendFriendRequest}
                        />
                    ))}
                </List>
            </Stack>
        </Dialog>
    );
};

export default Search;

/* eslint-disable no-unused-vars */
import {
    Container,
    Paper,
    TextField,
    Typography,
    Button,
    Stack,
    Avatar,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { useInputValidation, useFileHandler } from "6pp";
import {
    CameraAlt as CameraAltIcon,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { useState } from "react";
import { usernameValidator } from "../utils/validators";
import { bgGradient } from "../constants/color";
import { server } from "../constants/config";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import toast from "react-hot-toast";

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const name = useInputValidation("");
    const bio = useInputValidation("");
    const username = useInputValidation("", usernameValidator);
    const password = useInputValidation("");
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const avatar = useFileHandler("single");

    const toggleLogin = () => setIsLogin((prev) => !prev);

    const handleSignUp = async (e) => {
        e.preventDefault();

        const toastId = toast.loading("Signing Up...");
        setIsLoading(true);

        const formData = new FormData();

        formData.append("avatar", avatar.file);
        formData.append("name", name.value);
        formData.append("bio", bio.value);
        formData.append("username", username.value);
        formData.append("password", password.value);
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };

        try {
            const { data } = await axios.post(
                `${server}/api/v1/user/new`,
                formData,
                config
            );

            dispatch(userExists(data.user));
            toast.success(data.message, {
                id: toastId,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong", {
                id: toastId,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogIn = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Logging In...");

        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            console.log(1)
            const { data } = await axios.post(
                `${server}/api/v1/user/login`,
                {
                    username: username.value,
                    password: password.value,
                },
                config
            );
            console.log(data)
            dispatch(userExists(data.user));
            toast.success(data.message, {
                id: toastId,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong", {
                id: toastId,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                backgroundImage: bgGradient,
            }}
        >
            <Container
                component={"main"}
                maxWidth="xs"
                sx={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {isLogin ? (
                        <>
                            <Typography variant="h5">Login</Typography>
                            <form
                                style={{
                                    width: "100%",
                                    marginTop: "1rem",
                                }}
                                onSubmit={handleLogIn}
                            >
                                <TextField
                                    required
                                    fullWidth
                                    label="Username"
                                    margin="normal"
                                    variant="outlined"
                                    value={username.value}
                                    onChange={username.changeHandler}
                                />{" "}
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    margin="normal"
                                    variant="outlined"
                                    valuue={password.value}
                                    onChange={password.changeHandler}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleTogglePasswordVisibility}
                                                    edge="end"
                                                >
                                                    {!showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    sx={{
                                        marginTop: "1rem",
                                    }}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    disabled={isLoading}
                                >
                                    Login
                                </Button>
                                <Typography textAlign={"center"} m={"1rem"}>
                                    OR
                                </Typography>
                                <Button fullWidth variant="text" onClick={toggleLogin}>
                                    Sign Up Instead
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Typography variant="h5">Sign Up</Typography>
                            <form
                                style={{
                                    width: "100%",
                                    marginTop: "1rem",
                                }}
                                onSubmit={handleSignUp}
                            >
                                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                                    <Avatar
                                        sx={{
                                            width: "10rem",
                                            height: "10rem",
                                            objectFit: "contain",
                                        }}
                                        src={avatar.preview}
                                    />
                                    {avatar.error && (
                                        <Typography
                                            m={"1rem auto"}
                                            width={"fit-content"}
                                            display={"block"}
                                            color="error"
                                            variant="caption"
                                        >
                                            {avatar.error}
                                        </Typography>
                                    )}
                                    <IconButton
                                        sx={{
                                            position: "absolute",
                                            bottom: "0",
                                            right: "0",
                                            color: "white",
                                            bgcolor: "rgba(0,0,0,0.5)",
                                            ":hover": {
                                                bgcolor: "rgba(0,0,0,0.7)",
                                            },
                                        }}
                                        component="label"
                                    >
                                        <>
                                            <CameraAltIcon />
                                            <VisuallyHiddenInput
                                                type="file"
                                                onChange={avatar.changeHandler}
                                            />
                                        </>
                                    </IconButton>
                                </Stack>
                                <TextField
                                    required
                                    fullWidth
                                    label="Name"
                                    margin="normal"
                                    variant="outlined"
                                    value={name.value}
                                    onChange={name.changeHandler}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Bio"
                                    margin="normal"
                                    variant="outlined"
                                    value={bio.value}
                                    onChange={bio.changeHandler}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    label="Username"
                                    margin="normal"
                                    variant="outlined"
                                    value={username.value}
                                    onChange={username.changeHandler}
                                />{" "}
                                {username.error && (
                                    <Typography color="error" variant="caption">
                                        {username.error}
                                    </Typography>
                                )}
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    margin="normal"
                                    variant="outlined"
                                    value={password.value}
                                    onChange={password.changeHandler}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleTogglePasswordVisibility}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    sx={{
                                        marginTop: "1rem",
                                    }}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    disabled={isLogin}
                                >
                                    Sign Up
                                </Button>
                                <Typography textAlign={"center"} m={"1rem"}>
                                    OR
                                </Typography>
                                <Button fullWidth variant="text" onClick={toggleLogin}>
                                    Log In Instead
                                </Button>
                            </form>
                        </>
                    )}
                </Paper>
            </Container>
        </div>
    );
};

export default Login;

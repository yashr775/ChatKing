import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { bgGradient } from "../../constants/color";
import { useInputValidation } from "6pp";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const dispatch = useDispatch();

    const { isAdmin } = useSelector((state) => state.auth);
    const secretKey = useInputValidation("");

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(adminLogin(secretKey.value));
    };

    useEffect(() => {
        dispatch(getAdmin());
    }, [dispatch]);

    if (isAdmin) {
        return <Navigate to="/admin/dashboard" />;
    }

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
                    <Typography variant="h5">Admin Login</Typography>
                    <form
                        style={{
                            width: "100%",
                            marginTop: "1rem",
                        }}
                        onSubmit={submitHandler}
                    >
                        <TextField
                            required
                            fullWidth
                            label="Secret Key"
                            type={showPassword ? "text" : "password"}
                            margin="normal"
                            variant="outlined"
                            value={secretKey.value}
                            onChange={secretKey.changeHandler}
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
                        >
                            Login
                        </Button>
                    </form>
                </Paper>
            </Container>
        </div>
    );
};

export default AdminLogin;

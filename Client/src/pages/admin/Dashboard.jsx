import { Container, Paper, Stack, Box, Typography } from "@mui/material";
import AdminLayout from "../../components/layout/AdminLayout";
import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    Notifications as NotificationsIcon,
    Group as GroupIcon,
    Person as PersonIcon
} from "@mui/icons-material";
import moment from "moment";
import {
    CurveButton,
    SearchField,
} from "../../components/styles/StyledComponents";
import { LineChart, DoughnutChart } from "../../components/specific/Charts";

const Dashboard = () => {
    const Appbar = (
        <Paper
            elevation={3}
            sx={{ padding: "2rem", margin: "2rem 0", borderRadius: "1rem" }}
        >
            <Stack>
                <AdminPanelSettingsIcon sx={{ fontSize: "3rem" }} />

                <SearchField placeholder="Search..." />

                <CurveButton>Search</CurveButton>
                <Box flexGrow={1} />
                <Typography
                    display={{
                        xs: "none",
                        lg: "block",
                    }}
                    color={"rgba(0,0,0,0.7)"}
                    textAlign={"center"}
                >
                    {moment().format("dddd, D MMMM YYYY")}
                </Typography>

                <NotificationsIcon />
            </Stack>
        </Paper>
    );

    const Widgets = <>Widgets</>;

    return (
        <AdminLayout>
            <Container component={"main"}>
                {Appbar}
                <Stack
                    direction={{
                        xs: "column",
                        lg: "row",
                    }}
                    flexWrap={"wrap"}
                    justifyContent={"center"}
                    alignItems={{
                        xs: "center",
                        lg: "stretch",
                    }}
                    sx={{ gap: "2rem" }}
                > <Paper
                    elevation={3}
                    sx={{
                        padding: "2rem 3.5rem",
                        borderRadius: "1rem",
                        width: "100%",
                        maxWidth: "45rem",
                    }}
                >
                        <Typography margin={"2rem 0"} variant="h4">
                            Last Messages
                        </Typography>

                        <LineChart />
                    </Paper> <Paper
                        elevation={3}
                        sx={{
                            padding: "1rem ",
                            borderRadius: "1rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: { xs: "100%", sm: "50%" },
                            position: "relative",
                            maxWidth: "25rem",
                        }}
                    >
                        <DoughnutChart
                            labels={["Single Chats", "Group Chats"]}

                        />

                        <Stack
                            position={"absolute"}
                            direction={"row"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            spacing={"0.5rem"}
                            width={"100%"}
                            height={"100%"}
                        >
                            <GroupIcon /> <Typography>Vs </Typography>
                            <PersonIcon />
                        </Stack>
                    </Paper></Stack>
                {Widgets}
            </Container>
        </AdminLayout>
    );
};

export default Dashboard;

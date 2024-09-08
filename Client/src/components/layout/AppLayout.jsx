/* eslint-disable react/display-name */

import Header from "./Header";
import Title from "../shared/Title";
import { Grid } from "@mui/material";
const AppLayout = (WrappedComponent) => {
    return (props) => {
        return (
            <>
                <Title title={"Chat App"} description="jklffd" />
                <Header />
                <Grid container height={"calc(100vh - 4rem)"} sx={{ width: "100%" }}>
                    <Grid item
                        sm={4}
                        md={3}
                        lg={3}

                        sx={{
                            display: { xs: "none", sm: "block" },
                        }}
                        height={"100%"}>
                        First
                    </Grid>
                    <Grid item xs={12} sm={8} md={5} lg={5} height={"100%"}>
                        {" "}
                        <WrappedComponent {...props} />
                    </Grid>
                    <Grid item
                        md={4}
                        lg={4}

                        height={"100%"}
                        sx={{
                            display: { xs: "none", md: "block" },
                            padding: "2rem",
                            bgcolor: "rgba(0,0,0,0.85)",
                        }}>Third</Grid>
                </Grid >
            </>
        );
    };
};

export default AppLayout;


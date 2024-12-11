import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

function About() {
  return (
    <Box sx={{ padding: "3rem", backgroundColor: "#f8e8e8", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{ color: "#7B3F3F", fontWeight: "bold", marginBottom: "2rem", textAlign: "center" }}
      >
        About Us
      </Typography>

      <Typography
        variant="body1"
        sx={{ marginBottom: "2rem", textAlign: "center", fontSize: "1.2rem", color: "#7B3F3F" }}
      >
        Welcome to Rose Charity Event Management, a platform dedicated to helping underprivileged women through impactful
        events. Our team of skilled professionals works tirelessly to create a bridge between
        communities and resources. Together, we strive to make a difference in the lives of those who need it most.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#D08C8C", color: "white", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Our Team
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                We are a passionate group of individuals, including project managers, designers, and developers,
                who share a common goal: to make the world a better place. Each member brings unique skills and
                dedication to our mission.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#7B3F3F", color: "white", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Our Values
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                Integrity, compassion, and innovation drive us forward. We believe in creating a sustainable impact
                while upholding the dignity and respect of every individual we serve.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#f1c3c3", color: "#7B3F3F", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                About Rose Charity
              </Typography>
              <Typography variant="body1" sx={{ marginTop: "1rem" }}>
                Rose Charity is devoted to hosting events that bring hope to underprivileged women.
                Through health campaigns, we aim to ensure good health for all, expecially needy women, as it a vital right.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography
        variant="body1"
        sx={{ marginTop: "3rem", textAlign: "center", fontSize: "1.2rem", color: "#7B3F3F" }}
      >
        Join us in our mission to create opportunities and build a better future for everyone. Together, we can
        make a difference.
      </Typography>
    </Box>
  );
}

export default About;

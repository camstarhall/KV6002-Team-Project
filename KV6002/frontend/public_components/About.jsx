import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function About() {
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      sx={{ padding: "3rem", backgroundColor: "#f8e8e8", minHeight: "100vh" }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "#7B3F3F",
          fontWeight: "bold",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        About Us
      </Typography>

      <Typography
        variant="body1"
        sx={{
          marginBottom: "2rem",
          textAlign: "center",
          fontSize: "1.2rem",
          color: "#7B3F3F",
        }}
      >
        Welcome to Rose Charity Event Management, a platform dedicated to
        helping underprivileged women through impactful events. Our team of
        skilled professionals works tirelessly to create a bridge between
        communities and resources. Together, we strive to make a difference in
        the lives of those who need it most.
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent="center"
      >
        <Grid
          item
          xs={12}
          md={4}
        >
          <Card
            sx={{
              backgroundColor: "#D08C8C",
              color: "white",
              boxShadow: 3,
              borderRadius: "8px",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold" }}
              >
                Our Team
              </Typography>
              <Typography
                variant="body1"
                sx={{ marginTop: "1rem" }}
              >
                We are a passionate group of individuals, including project
                managers, designers, and developers, who share a common goal: to
                make the world a better place. Each member brings unique skills
                and dedication to our mission.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
        >
          <Card
            sx={{
              backgroundColor: "#7B3F3F",
              color: "white",
              boxShadow: 3,
              borderRadius: "8px",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold" }}
              >
                Our Values
              </Typography>
              <Typography
                variant="body1"
                sx={{ marginTop: "1rem" }}
              >
                Integrity, compassion, and innovation drive us forward. We
                believe in creating a sustainable impact while upholding the
                dignity and respect of every individual we serve.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
        >
          <Card
            sx={{
              backgroundColor: "#f1c3c3",
              color: "#7B3F3F",
              boxShadow: 3,
              borderRadius: "8px",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold" }}
              >
                About Rose Charity
              </Typography>
              <Typography
                variant="body1"
                sx={{ marginTop: "1rem" }}
              >
                Rose Charity is devoted to hosting events that bring hope to
                underprivileged women. Through health campaigns, we aim to
                ensure good health for all, especially needy women, as it is a
                vital right.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Typography
        variant="h5"
        sx={{
          marginTop: "3rem",
          marginBottom: "1.5rem",
          textAlign: "center",
          color: "#7B3F3F",
          fontWeight: "bold",
        }}
      >
        Frequently Asked Questions
      </Typography>

      <Box sx={{ maxWidth: "800px", margin: "0 auto" }}>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleAccordionChange("panel1")}
          sx={{
            backgroundColor: "#D08C8C",
            color: "white",
            marginBottom: "1rem",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold" }}
            >
              What is our charity target group?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Our target group is underprivileged women, specifically those aged
              30-60 and in the B40 income threshold. These women often face
              challenges in accessing opportunities and resources, and we aim to
              bridge this gap.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleAccordionChange("panel2")}
          sx={{
            backgroundColor: "#7B3F3F",
            color: "white",
            marginBottom: "1rem",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold" }}
            >
              How can I volunteer for your events?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Volunteering opportunities are open to all individuals who share
              our values and commitment to making a difference. Please visit our
              "Contact Us" page to learn more about how to get involved.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleAccordionChange("panel3")}
          sx={{
            backgroundColor: "#f1c3c3",
            color: "#7B3F3F",
            marginBottom: "1rem",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#7B3F3F" }} />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold" }}
            >
              How do I cancel my booking?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              To cancel your booking, simply reply to the SMS confirmation you
              received with the word CANCEL followed by your unique booking ID.
              The booking confirmation message you initially received contains
              the exact format and booking ID required for cancellation (e.g.,
              CANCEL 0zhvvSBIVaw3lZhHz4G3). When you send this reply, the system
              matches your phone number and booking ID to verify your request.
              If everything checks out, the system updates the booking status to
              “Cancelled” in the database and sends you a confirmation SMS
              letting you know that your booking has been successfully
              cancelled. If there is an issue, such as a mismatch of your phone
              number or an invalid booking ID, the system will notify you with
              appropriate instructions.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}

export default About;

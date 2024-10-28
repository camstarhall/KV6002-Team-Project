import React, { useState, useEffect } from "react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

// Register the English locale for the countries library
countries.registerLocale(enLocale);

const Register = () => {
  // State for each input field
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sex, setSex] = useState("Male");
  const [employment, setEmployment] = useState("Employed");
  const [salary, setSalary] = useState("");
  const [password, setPassword] = useState("");

  // Get a list of all countries in English
  const countryList = Object.entries(countries.getNames("en", { select: "official" }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      {/* Left Side */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#D08C8C",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          textAlign: "center",
          paddingTop: "2rem",
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: "0.5rem", color: "black" }}>
          ROSE CHARITY
        </Typography>
        <Typography variant="h6" sx={{ color: "black" }}>
          You can enjoy managing and booking events with us
        </Typography>
      </Box>

      {/* Right Side */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#D08C8C",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: "2rem",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: "1rem", color: "black" }}>
          Register your account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: "1rem" }}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            fullWidth
            sx={{ marginBottom: "1rem" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormControl fullWidth sx={{ marginBottom: "1rem" }} required>
            <InputLabel>Select your country</InputLabel>
            <Select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <MenuItem value="" disabled>
                Select your country
              </MenuItem>
              {countryList.map(([code, name]) => (
                <MenuItem key={code} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            sx={{ marginBottom: "1rem" }}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <FormControl fullWidth sx={{ marginBottom: "1rem" }} required>
            <InputLabel>Sex</InputLabel>
            <Select value={sex} onChange={(e) => setSex(e.target.value)}>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: "1rem" }} required>
            <InputLabel>Employment</InputLabel>
            <Select value={employment} onChange={(e) => setEmployment(e.target.value)}>
              <MenuItem value="Employed">Employed</MenuItem>
              <MenuItem value="Unemployed">Unemployed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Salary"
            variant="outlined"
            type="number"
            fullWidth
            sx={{ marginBottom: "1rem" }}
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            sx={{ marginBottom: "1rem" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#7B3F3F",
              color: "white",
              "&:hover": {
                backgroundColor: "#6a3232",
              },
            }}
            fullWidth
          >
            Register
          </Button>
        </form>
        <Typography sx={{ marginTop: "1rem", textAlign: "center", color: "black" }}>
          Already have an account? <Link href="/login">Login</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;

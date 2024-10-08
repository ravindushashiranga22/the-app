import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  CssBaseline,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import backgroundImage from './wall.jpg'; // Import your background image
import newLogo from './new logo.png'; // Import your new logo here

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff5722',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let formValid = true;
    let newErrors = { email: '', password: '' };

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
      formValid = false;
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
      formValid = false;
    }

    setErrors(newErrors);
    return formValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.user && result.user._id) {
        await window.localStorage.setItem('token', result.token);
        await window.localStorage.setItem('user', result.user._id);
        await window.localStorage.setItem('role', result.user.role);
        if (result.user.role === "Shop") {
          navigate("/orders");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSignUpClick = () => {
    navigate("/register");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            backgroundColor: 'rgba(166, 110, 56, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            padding: 4,
            boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          }}
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src={newLogo} alt="New Logo" style={{ width: '80%', marginBottom: '16px' }} />
            <Typography component="h1" variant="h5" sx={{ color: '#96CEB4', textAlign: 'center' }}>
              Sign In
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      style: { color: '#96CEB4' },
                    }}
                    InputLabelProps={{
                      style: { color: '#96CEB4' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleClickShowPassword} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      style: { color: '#96CEB4' },
                    }}
                    InputLabelProps={{
                      style: { color: '#96CEB4' },
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: '#96CEB4' }}
              >
                Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link variant="body2" onClick={handleSignUpClick} sx={{ color: '#96CEB4' }}>
                    Don't have an account? Sign up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;

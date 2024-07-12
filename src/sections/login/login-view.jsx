import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { BACKEND_URL } from 'src/constant/url';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Copyright from 'src/components/Copyright';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();
  const [input, setInput] = useState({ username: '', password: '' });
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: false, password: false });

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };
  const hasEmpty = () => {
    const { username, password } = input;
    const usernameIsEmpty = username === '';
    const passwordIsEmpty = password === '';
    if (usernameIsEmpty) {
      setErrors((prevState) => ({
        ...prevState,
        username: usernameIsEmpty
      }));
    }

    if (passwordIsEmpty) {
      setErrors((prevState) => ({
        ...prevState,
        password: passwordIsEmpty
      }));
    }
    return !!(usernameIsEmpty || passwordIsEmpty);
  }
  const handleClick = async () => {
    if (hasEmpty()) {
      return;
    }
    setIsLoading(true);
    setIsIncorrect(false);
    setErrors({ username: false, password: false });

    try {
      const response = await fetch(`${BACKEND_URL}/user/login`, {
        method: 'POST',
        body: JSON.stringify(input),
        headers: { 'Content-Type': 'application/json' },
      });
      // TODO: Store JWT from the returned data
      const data = await response.json();
      console.log(data);
      router.push('/');
    } catch (error) {
      console.log(error);
      setIsIncorrect(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevState) => ({ ...prevState, [name]: false }));
    setIsIncorrect(false);
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <Collapse in={isIncorrect} onClick={() => setIsIncorrect(false)}>
          <Alert severity="error">Incorrect username or password.</Alert>
        </Collapse>
        <TextField
          required
          name="username"
          label="Username"
          error={errors.username}
          helperText={errors.username ? 'Username is required' : ''}
          onChange={handleChange}
          onKeyDown={handleEnter}
        />

        <TextField
          required
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          error={errors.password}
          helperText={errors.password ? 'Password is required' : ''}
          onChange={handleChange}
          onKeyDown={handleEnter}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1, mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              value="remember"
              color="primary"
              sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}
            />
          }
          label="Remember me"
        />
        <Link variant="body1" underline="hover">
          Forgot password
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={isLoading}
        onClick={handleClick}
      >
        Login
      </LoadingButton>

      <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
        Don’t have an account?
        <Link variant="subtitle2" sx={{ ml: 0.5 }}>
          Create account
        </Link>
      </Typography>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.3),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" sx={{ mb: 3 }}>
            Sign in
          </Typography>
          {renderForm}
          <Copyright />
        </Card>
      </Stack>
    </Box>
  );
}

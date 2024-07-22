import Cookies from 'js-cookie';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
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
import { useAuth } from 'src/authentification';
import { BACKEND_URL } from 'src/constants/url';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Copyright from 'src/components/Copyright';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const { login } = useAuth();
  const router = useRouter();
  const [input, setInput] = useState({ username: '', password: '' });
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [empty, setEmpty] = useState({ username: false, password: false });

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };
  const containsEmptyField = () => {
    const changeEmptyState = (elem) => {
      const name = elem[0];
      const value = elem[1];
      if (value === '') {
        setEmpty((prevState) => ({
          ...prevState,
          [name]: true
        }));
      }
    }
    Object.entries(input).forEach((elem) => { changeEmptyState(elem) });
    return Object.values(input).includes('');
  }
  const handleClick = async () => {
    if (containsEmptyField()) {
      return;
    }
    setIsLoading(true);
    setShowAlert(false);

    try {
      const response = await fetch(`${BACKEND_URL}/user/login`, {
        method: 'POST',
        body: JSON.stringify(input),
        headers: { 'Content-Type': 'application/json' },
      });
      // Set JWt and user info into cookies
      const jwt = response.headers.get('token');
      Cookies.set('token', jwt,
        { secure: true, sameSite: 'strict', expires: 1 });
      const data = await response.json();
      Cookies.set('userObj', JSON.stringify(data),
        { secure: true, sameSite: 'strict', expires: 1 });

      login(data.username);
      router.push('/');
    } catch (error) {
      console.log(error);
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((prevState) => ({ ...prevState, [name]: value }));
    setEmpty((prevState) => ({ ...prevState, [name]: false }));
    setShowAlert(false);
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <Collapse in={showAlert}>
          <Alert severity="error">Incorrect username or password.</Alert>
        </Collapse>
        <TextField
          required
          name="username"
          label="Username"
          error={empty.username}
          title='Please put your username here'
          helperText={empty.username ? 'Username is required' : ''}
          onChange={handleChange}
          onKeyDown={handleEnter}
        />

        <TextField
          required
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          title='Please put your password here'
          error={empty.password}
          helperText={empty.password ? 'Password is required' : ''}
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
        <Tooltip title="Please contact Weiyang to retrieve password, thanks" placement='right' arrow>
        <Link variant="body1" underline="none">
          Forgot password
        </Link>

        </Tooltip>
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
        <Link href="/signup" variant="subtitle2" sx={{ ml: 0.5 }}>
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
        disabledLink
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

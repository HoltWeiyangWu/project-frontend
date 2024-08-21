import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import { BACKEND_URL } from 'src/constants/url';
import { PASSWORD_MIN, USERNAME_REX } from 'src/constants/signup-constants';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import Copyright from 'src/components/Copyright';

// ----------------------------------------------------------------------

export default function SignupView() {
  const theme = useTheme();

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({ username: '', password: '', confirmPassword: '' });
  const [empty, setEmpty] = useState({ username: false, password: false, confirmPassword: false });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isUnformatted, setIsUnformatted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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

  const wrongFormat = () => {
    const match = input.username.match(USERNAME_REX);
    const wrongUsername = !match?.[0];
    const wrongPassword = input.password.length < PASSWORD_MIN;
    const wrongConfirmPassword = input.password !== input.confirmPassword;
    return wrongUsername || wrongPassword || wrongConfirmPassword;
  }

  const handleClick = async () => {
    if (containsEmptyField()) return;
    if (wrongFormat()) {
      setIsUnformatted(true);
      return;
    }

    setIsLoading(true);
    setIsUnformatted(false);
    try {
      const response = await fetch(`${BACKEND_URL}/user/register`, {
        method: 'POST',
        body: JSON.stringify(input),
        headers: { 'Content-Type': 'application/json' },
      });
      // TODO: Complete error handling once the backend is ready
      const resObj = await response.json();
      const {data} = resObj;
      if (data === -1) {
        throw Error();
      }
      router.push('/login');
    } catch (error) {
      setIsRegistered(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((prevState) => ({ ...prevState, [name]: value }));
    setEmpty((prevState) => ({ ...prevState, [name]: false }));
  };

  const handleUsernameChange = (event) => {
    setIsRegistered(false);
    handleChange(event);
  }

  const showUsrenameMsg = () => {
    if (isRegistered) return 'This username has been registered';
    if (empty.username) return 'Username is required'
    if (isUnformatted) return 'At least 4 characters long with no punctuations and whitespace';
    return '';
  }
  const showPwdMsg = () => {
    if (empty.password) return 'Password is required'
    if (isUnformatted) return 'At least 8 characters long';
    return '';
  }
  const showConfirmPwdMsg = () => {
    if (empty.confirmPassword) return 'Confirm password is required'
    if (isUnformatted) return 'Must be same as password';
    return '';
  }

  const renderForm = (
    <>
      <Stack spacing={3}>
        <Collapse in={isUnformatted}>
          <Alert severity="error">Incorrect format. Please check your input.</Alert>
        </Collapse>
        <TextField
          required name="username"
          label="Username"
          title='Please put your username here'
          error={isRegistered}
          helperText={showUsrenameMsg()}
          onChange={handleUsernameChange}
        />

        <TextField
          required
          name="password"
          label="Password"
          title='Please put your password here'
          type={showPassword ? 'text' : 'password'}
          helperText={showPwdMsg()}
          onChange={handleChange}
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
        
        <TextField
          required
          name="confirmPassword"
          label="Confirm password"
          title='Please type your password here again'
          type={showConfirmPassword ? 'text' : 'password'}
          helperText={showConfirmPwdMsg()}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        loading={isLoading}
        sx={{my: 2}}
      >
        Sign up
      </LoadingButton>

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
          <Typography  variant="h4" sx={{ mb: 3 }}>Sign up</Typography>
          {renderForm}
          <Copyright/>
        </Card>
      </Stack>
    </Box>
  );
}

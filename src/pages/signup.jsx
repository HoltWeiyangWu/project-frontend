import { Helmet } from 'react-helmet-async';

import { SignupView } from 'src/sections/signup';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Signup</title>
      </Helmet>

      <SignupView />
    </>
  );
}

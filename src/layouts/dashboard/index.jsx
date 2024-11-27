import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import Nav from './nav';
import Main from './main';
import Header from './header';
import { AvatarProvider } from './avatar-provider';

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);

  return (
      <AvatarProvider>
        <Header onOpenNav={() => setOpenNav(true)} />

        <Box
          sx={{
            minHeight: 1,
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

          <Main>{children}</Main>
          </Box>
      </AvatarProvider>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

import { Helmet } from 'react-helmet-async';

import { SettingView } from 'src/sections/setting';

// ----------------------------------------------------------------------

export default function SettingPage() {
  return (
    <>
      <Helmet>
        <title>Setting</title>
      </Helmet>

      <SettingView />
    </>
  );
}

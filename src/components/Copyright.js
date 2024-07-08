import GitHubIcon from '@mui/icons-material/GitHub';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link
        color="inherit"
        href="https://github.com/HoltWeiyangWu"
        target="_blank"
      >
        Weiyang Wu
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
      <a
        href="https://github.com/HoltWeiyangWu"
        target="_blank"
        rel="noreferrer"
      >
        <span style={{ padding: '15px', color: 'black' }}>
          <GitHubIcon />
        </span>
      </a>
      <a
        href="https://github.com/HoltWeiyangWu"
        target="_blank"
        rel="noreferrer"
      >
        <span style={{ color: '#0a66c2', margin: 0 }}>
          <LinkedInIcon fontSize="medium" />
        </span>
      </a>
    </Typography>
  );
}

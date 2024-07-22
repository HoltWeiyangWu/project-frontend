import Cookies from 'js-cookie';
import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { BACKEND_URL } from 'src/constants/url';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  role,
  id,
  username,
  email,
  createTime,
  updateTime,
  reloadStatus,
  handleReload,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  const [popUp, setPopUp] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteFail, setDeleteFail] = useState(false);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteClick = async() => {
    try {
      const response = await fetch(`${BACKEND_URL}/user/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${Cookies.get('token')}` },
      });
      const status = await response.text();
      if (status === 'true') {
        setDeleteSuccess(true);
        
      } else {
        setDeleteFail(true);
      }
    } catch (error) {
      setDeleteFail(true);
    } finally {
      setOpen(null);
      setPopUp(false);
    }
  }

  const handleOpenDialog = () => {
    setPopUp(true);
  }
  const handleCloseDialog = () => {
    setPopUp(false);
    setOpen(null);
  }

  const handleCloseSuccessDelDialog = () => {
    handleCloseDialog();
    handleReload(!reloadStatus);
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{username}</TableCell>

        <TableCell>{role}</TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{createTime}</TableCell>

        <TableCell>{updateTime}</TableCell>


        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Dialog
        open={popUp}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete confirm
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`This user ${username} will be permanently deleted. Do you still want to delete?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button color="error" onClick={handleDeleteClick} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteSuccess}
        onClose={handleCloseSuccessDelDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
        {`Successfully delete the user ${username}.`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => { setDeleteSuccess(false); handleCloseSuccessDelDialog() }}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteFail}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
        {`Fail to delete the user ${username}.`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={()=>setDeleteFail(false)}>OK</Button>
        </DialogActions>
      </Dialog>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem disabled={username === JSON.parse(Cookies.get('userObj')).username}
          onClick={handleOpenDialog} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  username: PropTypes.any,
  handleClick: PropTypes.func,
  email: PropTypes.any,
  createTime: PropTypes.any,
  updateTime: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  id: PropTypes.any,
  reloadStatus: PropTypes.bool,
  handleReload: PropTypes.func,
  selected: PropTypes.any,
};

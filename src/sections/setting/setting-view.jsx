    import Cookies from 'js-cookie';
    import { useState} from 'react';

    import Box from '@mui/material/Box';
    import Card from '@mui/material/Card';
    import Alert from '@mui/material/Alert';
    import Badge from '@mui/material/Badge';
    import Button from '@mui/material/Button';
    import Avatar from '@mui/material/Avatar';
    import Divider from '@mui/material/Divider';
    import Collapse from '@mui/material/Collapse';
    import TextField from '@mui/material/TextField';
    import Container from '@mui/material/Container';
    import IconButton from '@mui/material/IconButton';
    import Typography from '@mui/material/Typography';
    import LoadingButton from '@mui/lab/LoadingButton';

    import { BACKEND_URL } from 'src/constants/url';
    import { useAvatar } from 'src/layouts/dashboard/avatar-provider';

    export default function SettingView() {
        const account = JSON.parse(Cookies.get('userObj'));
        const { avatarUrl, updateAvatarUrl } = useAvatar();
        const initProfile = {
            name: account?.name,
            email: account?.email,
            profile: account?.profile
        }

        const [avatar, setAvatar] = useState(null);
        const [isHidden, setIsHidden] = useState(true); // For filename display
        const [profile, setProfile] = useState(initProfile);
        const [isLoading, setIsLoading] = useState(false); // For loading save button
        const [openSucess, setOpenSucess] = useState(false); // For success alert
        const [openFail, setOpenFail] = useState(false); // For fail alert

        const handleAvatar = (event) => {
            const file = event.target.files[0];
            setAvatar(file);
            setIsHidden(file == null);
        }
        const handleCancel = () => {
            setAvatar(null);
            setIsHidden(true);
            setProfile(initProfile);
        }

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setProfile((prev) => ({
            ...prev,
            [name]: value,
            }));
        };

        const handleSave = async () => {
            setIsLoading(true);
            // send multipart request
            const formData = new FormData();
            formData.append("avatar", avatar);
            const data = new Blob([JSON.stringify(profile)], {
                type: 'application/json'
            })
            formData.append("data", data);

            try {
                const response = await fetch(`${BACKEND_URL}/user/setting`, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Authorization': `Bearer ${Cookies.get('token')}` },
                });
                if (response.status === 200) {
                    setOpenSucess(true);
                    
                    // Update cookie
                    const resObj = await response.json();
                    const newProfile = JSON.stringify(resObj.data);
                    Cookies.set("userObj", newProfile, { expires: 1 });
                    
                    // Update global avatar url with cache busting
                    updateAvatarUrl(resObj?.data?.avatar);
                    
                    // Reset avatar selection and filename display
                    setAvatar(null);
                    setIsHidden(true);
                } else {
                    setOpenFail(true);
                }
                // TODO: Complete error handling once the backend is ready
            } catch (error) {
                console.log("failed");
            } finally {
                setIsLoading(false);
            }
        }

        const renderTop = (
            <Box
            sx={{
                py: 2,
                px: 2.5,
                display: 'flex',
                borderRadius: 1.5,
                alignItems: 'center',
                
            }}
            >
                <IconButton>
                    <label htmlFor="avatar-upload">
                    <Badge
                        badgeContent="Edit"
                        color="primary"
                        overlap='circular'
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}>
                        <Avatar src={avatarUrl}
                                alt={account.name.charAt(0).toUpperCase()}
                                sx={{ width: 80, height: 80 }} >
                            {account.name.charAt(0).toUpperCase()}
                        </Avatar>
                    </Badge>
                    <input
                        type="file"
                        accept="image/*"
                        id="avatar-upload"
                        hidden
                        onChange={handleAvatar}
                    />
                    </label>

                </IconButton>
        
            <Box sx={{ ml: 5 }}>
                <Typography variant="subtitle2">{account.name}</Typography>
        
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account.username}
                    </Typography>
                <Typography variant="caption" hidden={isHidden}>
                    {avatar?.name} is selected.
                </Typography>
                </Box>
            </Box>
        );


        return (
            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Setting
                </Typography>
                <Card>
                    <Collapse in={openSucess}>
                    <Alert severity="success"  onClose={()=>{setOpenSucess(false)}}>Profile updated successsfully.</Alert>
                    </Collapse>
                    <Collapse in={openFail}>
                    <Alert severity="error"  onClose={()=>{setOpenFail(false)}}>Profile fails to update.</Alert>
                    </Collapse>

                    <form>
                    {renderTop}
                    <Divider />
                    <Box sx={{ mx: 2.5 }}>
                            <Typography variant="subtitle1" mt={2}> Name </Typography>
                            <TextField
                                required
                                fullWidth
                                sx={{ mb: 2 }}
                                name='name'
                                defaultValue={profile?.name}
                                onChange={handleInputChange}
                            />
                            <Typography variant="subtitle1"> Username </Typography>
                            <TextField
                                fullWidth
                                disabled
                                sx={{mb:2}}
                                value={account.username}
                                
                            />
                            <Typography variant="subtitle1"> Email </Typography>
                            <TextField
                                fullWidth
                                sx={{ mb: 2 }}
                                name='email'
                                defaultValue={profile?.email}
                                onChange={handleInputChange}
                            />
                            <Typography variant="subtitle1"> Bio </Typography>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                name='profile'
                                sx={{mb:2}}
                                defaultValue={profile?.profile || ""}
                                onChange={handleInputChange}
                            />
                            <Box
                                display="flex"
                                justifyContent="space-around"
                                alignItems="center"
                                my={2}
                            >
                                <Button type='reset' color='inherit' onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <LoadingButton variant="contained" color="primary" onClick={handleSave} loading={isLoading}>
                                    Save
                                </LoadingButton>
                            </Box>
                            </Box>
                    </form>
                </Card>
                </Container>
        );
    }
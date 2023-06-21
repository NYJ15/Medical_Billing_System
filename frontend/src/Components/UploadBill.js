
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import configData from "../config.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

const defaultTheme = createTheme();

export default function UploadBill() {
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [imageUrl, setImageUrl] = React.useState(null);
    const [serviceDate, setServiceDate] = React.useState(null);
    const navigate = useNavigate();
    const baseURL = configData.BACKEND_URL
    const cookies = new Cookies();

    const handleSubmit = (event) => {
        event.preventDefault();
        const final_data = new FormData();
        final_data.append("image", selectedImage);
        final_data.append("firstName", event.target.firstName.value)
        final_data.append("lastName", event.target.lastName.value)
        final_data.append("address", event.target.address.value)
        final_data.append("hospitalName", event.target.hospitalName.value)
        final_data.append("billAmount", event.target.billAmount.value)
        final_data.append("serviceDate", serviceDate)
        
        const tokenStr = cookies.get('access_token')
        axios
            .post(baseURL + 'upload_bill', 
                final_data, {headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${tokenStr}`
                  }}
            )
            .then(response => {
                alert(response.data['result'])
                navigate('/')
            }).catch(error => {
                console.log(error)
            });
        
    };

    React.useEffect(() => {
        const tokenStr = cookies.get('access_token')
        let decodedToken = jwt_decode(tokenStr);
        let currentDate = new Date();
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            cookies.remove("access_token", { path: '/' })
            window.location = "/"
        }

        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Upload Bill
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    fullWidth
                                    id="firstName"
                                    label="Patient's First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="lastName"
                                    label="Patient's Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="address"
                                    label="Patient's Address"
                                    name="address"
                                    autoComplete="address"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="hospitalName"
                                    label="Hospital Name"
                                    id="hospitalName"
                                    autoComplete="hospital-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    name="billAmount"
                                    label="Bill Amount"
                                    id="billAmount"
                                    autoComplete="bill-amount"
                                    type="number" pattern="[0-9]*" inputmode="numeric"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Service Date"
                                        onChange={(date) => {
                                            const dateString = new Date(date).toLocaleDateString()
                                            setServiceDate(dateString)
                                          }}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    accept="image/*"
                                    type="file"
                                    id="select-image"
                                    style={{ display: "none" }}
                                    onChange={(e) => setSelectedImage(e.target.files[0])}
                                />
                                <label htmlFor="select-image">
                                    <Button variant="outlined" color="secondary" component="span">
                                        Upload Bill Image
                                    </Button>
                                </label>
                                {imageUrl && selectedImage && (
                                    <Box mt={2} textAlign="center">
                                        <div>Image Preview: {selectedImage.name}</div>
                                        <img src={imageUrl} alt={selectedImage.name} height="100px" />
                                    </Box>
                                )}
                            </Grid>

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Upload Bill
                        </Button>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

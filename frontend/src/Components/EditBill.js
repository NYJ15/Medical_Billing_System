
import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
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
import { useParams } from "react-router-dom";
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import jwt_decode from "jwt-decode";

const defaultTheme = createTheme();

function EditBill() {

    const [selectedImage, setSelectedImage] = React.useState(null);
    const [imageUrl, setImageUrl] = React.useState(null);
    const [serviceDate, setServiceDate] = React.useState(null);
    const [data, setData] = React.useState("");
    const [previousBill, setPreviousBill] = React.useState("");
    const navigate = useNavigate();
    const cookies = new Cookies();

    const initialValues = {
        address: data.address,
        amount: data.amount,
        bill_image: data.bill_image,
        first_name: data.first_name,
        hospital_name: data.hospital_name,
        id: data.id,
        last_name: data.last_name,
        service_date: data.service_date,
    }


    const [values, setValues] = React.useState(initialValues);

    const baseURL = configData.BACKEND_URL
    let { id } = useParams();

    React.useEffect(() => {
        const tokenStr = cookies.get('access_token')
        let decodedToken = jwt_decode(tokenStr);
        let currentDate = new Date();
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
            cookies.remove("access_token", { path: '/' })
            window.location = "/"
        }

        axios.get(baseURL + "upload_bill/" + id,  { headers: { "Authorization": `Bearer ${tokenStr}` } })
            .then((response) => {
                setData(response.data['result'])
                setValues(response.data['result'])
                setServiceDate(response.data['result'].service_date)
                setPreviousBill(response.data['result'].bill_image.split('/').pop())
            });
        

        if (data) {
            setData(data)
            setValues(data)
            setServiceDate(data.service_date)
        }

    }, []);

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
            .put(baseURL + 'upload_bill/' + data.id,final_data, { headers: { "Authorization": `Bearer ${tokenStr}` } },
                
            )
            .then(response => {
                alert(response.data['result'])
                navigate('/')
            }).catch(error => {
                console.log(error)
            });

    };

    React.useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
    };

    // if (!data) return null;

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
                        Edit Bill
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <input
                                    name="firstName"
                                    fullWidth
                                    id="firstName"
                                    label="Patient's First Name"
                                    autoFocus
                                    defaultValue={data.first_name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <input
                                    fullWidth
                                    id="lastName"
                                    label="Patient's Last Name"
                                    name="lastName"
                                    defaultValue={data.last_name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    fullWidth
                                    id="address"
                                    label="Patient's Address"
                                    name="address"
                                    defaultValue={data.address}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    fullWidth
                                    name="hospitalName"
                                    label="Hospital Name"
                                    id="hospitalName"
                                    defaultValue={data.hospital_name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    fullWidth
                                    name="billAmount"
                                    label="Bill Amount"
                                    id="billAmount"
                                    type="number" pattern="[0-9]*" inputmode="numeric"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    defaultValue={data.amount}
                                    onChange={handleInputChange}
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
                                        defaultValue={dayjs(data.service_date)}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12}>

                                Previous Bill:
                                {previousBill && (
                                    <Box mt={2} textAlign="center">
                                        <img src={process.env.PUBLIC_URL + "/" + previousBill} 
                                        height="100px"
                                        alt='Previous' />
                                    </Box>
                                )}
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
                                        Update Bill Image
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
                            Update Bill
                        </Button>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default EditBill;
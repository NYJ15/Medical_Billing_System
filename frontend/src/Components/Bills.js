import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import configData from "../config.json";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function Bills() {
    const baseURL = configData.BACKEND_URL
    const [data, setData] = React.useState(null);

    const columns = [
        { field: 'id', headerName: 'ID', width: 100, headerClassName: "table-header" },
        { field: 'first_name', headerName: 'First Name', width: 140, headerClassName: "table-header" },
        { field: 'last_name', headerName: 'Last Name', width: 140, headerClassName: "table-header" },
        { field: 'address', headerName: 'Address', width: 300, headerClassName: "table-header" },
        { field: 'hospital_name', headerName: 'Hospital Name', width: 180, headerClassName: "table-header" },
        { field: 'service_date', headerName: 'Date of Service', width: 170 },
        {
            field: 'amount',
            headerName: 'Amount ($)',
            type: 'number',
            width: 130,
        },
        {
            field: 'bill_image', headerName: 'Bill Image', width: 150,
            renderCell: (params) => {
                return (
                    <div>
                        <img
                            width="80px"
                            height="80px"
                            src={params.row.bill_image.split('/').pop()}
                            alt='' />
                    </div>
                )
            }
        },

        {
            field: 'action',
            headerName: 'Action',
            width: 100,
            sortable: false,
            disableClickEventBubbling: true,

            renderCell: (params) => {
                const onClick = (e) => {
                    const currentRow = params.row;
                    window.location = '/edit/' + currentRow.id
                };

                return (
                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" color="warning" size="small" onClick={onClick}>Edit</Button>
                    </Stack>
                );
            },
        }
    ];

    React.useEffect(() => {
        axios.get(baseURL + 'upload_bill')
            .then((response) => {
                setData(response.data['result']);
            });

    }, []);

    if (!data) return null;

    return (
        <div style={{ height: "auto", width: '100%', marginTop: "2%" }}>
            <Typography component="h1"
                variant="h5"
                sx={{
                    fontFamily: 'fangsong',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: '#6b9fd2',
                    textDecoration: 'none',
                }}>
                All Bills
            </Typography>
            <DataGrid
                sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: 'primary.light',
                    '& .MuiDataGrid-cell:hover': {
                        color: 'primary.main',
                    },
                }}
                rows={data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                getRowId={(row) => row.id} />
        </div>
    );
}

export default Bills;
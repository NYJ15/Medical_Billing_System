//file: src/Components/index.js

import React from 'react';

import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import UploadBill from './UploadBill';
import EditBill from './EditBill';
import Bills from './Bills';

const Components = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Bills />} />
                <Route path="/create" element={<UploadBill />} />
                <Route path="/edit/:id" element={<EditBill />} />
            </Routes>
        </Router>
    );
};

export default Components;
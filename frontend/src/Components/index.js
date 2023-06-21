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
import SignUp from './SignUp';
import SignIn from './SignIn';

const Components = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Bills />} />
                <Route path="/create" element={<UploadBill />} />
                <Route path="/edit/:id" element={<EditBill />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
            </Routes>
        </Router>
    );
};

export default Components;
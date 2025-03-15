import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Typography,
    Alert,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { AccessAlarm, AdminPanelSettings, Message } from '@mui/icons-material';

function AdvisorMemberseenewcxdetails() {
    const { customerId } = useParams();

    return (
        <div>
            <Tagging customerId={customerId} />
        </div>
    );
}

function Tagging({ customerId }) {
    const [error, setError] = useState("");
    const [taggingRecords, setTaggingRecords] = useState([]);

    useEffect(() => {
        const fetchTaggingDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/advisory-member/tagging/${customerId}`,
                    { withCredentials: true }
                );

                if (response.data.tagging && response.data.tagging.tags) {
                    const sortedTags = response.data.tagging.tags.sort((a, b) => {
                        return new Date(b.taggedDate) - new Date(a.taggedDate);
                    });
                    setTaggingRecords(sortedTags);
                } else {
                    setError("No tagging records found.");
                }
            } catch (error) {
                setError("Failed to fetch tagging details");
                toast.error("Failed to fetch tagging details");
            }
        };

        if (customerId) {
            fetchTaggingDetails();
        }
    }, [customerId]);

    if (!customerId) {
        return (
            <Container className="mt-4">
                <Alert severity="error">Customer ID is required.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{
            mt: 4,
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
            backgroundColor: 'rgba(15, 21, 53, 0.7)',
            backdropFilter: 'blur(10px)',
            color: 'white',
        }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            {error && <Alert severity="error" sx={{ color: 'white' }}>{error}</Alert>}
            <Typography variant="h4" align="center" sx={{
                fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', mb: 4, color: 'white'
            }}>
                Tagging Details
            </Typography>

            {taggingRecords.length > 0 ? (
                <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)', color: 'white' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="tagging records table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>Advisor Name</TableCell>
                                <TableCell sx={{ color: 'white' }}>Date and Time</TableCell>
                                <TableCell sx={{ color: 'white' }}>Service 1</TableCell>
                                <TableCell sx={{ color: 'white' }}>Service 2</TableCell>
                                <TableCell sx={{ color: 'white' }}>Remarks</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {taggingRecords.map((tag) => (
                                <TableRow key={tag._id}>
                                    <TableCell sx={{ color: 'white' }}>
                                        <AdminPanelSettings sx={{ color: 'lime', verticalAlign: 'middle', mr: 1 }} />
                                        {tag.advisorName || 'N/A'}
                                    </TableCell>
                                    <TableCell sx={{ color: 'white' }}>
                                        {tag.taggedDate ? new Date(tag.taggedDate).toLocaleString() : 'N/A'}
                                    </TableCell>
                                    <TableCell sx={{ color: 'white' }}>
                                        {tag.service1}
                                    </TableCell>
                                    <TableCell sx={{ color: 'white' }}>
                                        {tag.service2}
                                    </TableCell>
                                    <TableCell sx={{ color: 'white' }}>
                                        <Message sx={{ color: 'lime', verticalAlign: 'middle', mr: 1 }} />
                                        {tag.remarks || 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="h6" align="center" color="text.secondary" sx={{ fontWeight: 'bold', color: 'white' }}>
                    No tagging records available.
                </Typography>
            )}
        </Container>
    );
}

export default AdvisorMemberseenewcxdetails;
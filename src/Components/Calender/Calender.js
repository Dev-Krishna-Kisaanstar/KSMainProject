// Calendar.js
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Typography, Button, Modal } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Today, CalendarToday } from '@mui/icons-material';

const Calendar = ({ onDateSelect }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDateClick = ({ dateStr }) => {
        const clickedDate = new Date(dateStr);

        // Check if clicked date is in the future
        if (clickedDate > new Date()) {
            return toast.error("Future dates are not allowed!");
        }

        // Handle date selection
        if (!startDate) {
            setStartDate(clickedDate);
            toast.success(`Start date set to ${clickedDate.toLocaleDateString()}`);
        } else if (clickedDate > startDate) {
            setEndDate(clickedDate);
            toast.success(`End date set to ${clickedDate.toLocaleDateString()}`);
            onDateSelect({ start: startDate.toISOString().split('T')[0], end: clickedDate.toISOString().split('T')[0] }); // Fetch orders automatically
        } else {
            toast.error("End date must be after start date!");
        }
    };

    return (
        <>
            <ToastContainer />
            <Box p={2}>
                <Button variant="contained" color="success" onClick={() => handleDateClick({ dateStr: new Date().toISOString().split('T')[0] })}>
                    <Today /> Today
                </Button>
                <Button variant="contained" color="success" onClick={() => setIsModalOpen(true)}>
                    <CalendarToday /> Calendar
                </Button>
            </Box>

            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box p={3} bgcolor="#333" color="white" width={400} mx="auto" mt={8} borderRadius={2}>
                    <Typography variant="h6" textAlign="center">Select a Date Range</Typography>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        dateClick={handleDateClick}
                        height={300}
                    />
                    <Button variant="contained" color="success" fullWidth onClick={() => setIsModalOpen(false)}>Close</Button>
                </Box>
            </Modal>
        </>
    );
};

export default Calendar;
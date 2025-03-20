import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Typography, Button, Modal } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CalendarToday } from '@mui/icons-material';

const Calendar = ({ onDateSelect }) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);

    const handleDateClick = ({ dateStr }) => {
        const selectedDate = new Date(dateStr);
        
        // Disallow future dates
        if (selectedDate > new Date()) {
            return toast.error("Future dates are not allowed!");
        }

        if (!startDate) {
            setStartDate(dateStr);
            setIsSelectingEndDate(true);
            toast.info("Now select the end date.");
        } else if (isSelectingEndDate) {
            if (new Date(dateStr) < new Date(startDate)) {
                toast.error("End date cannot be before start date!");
                return;
            }
            setEndDate(dateStr);
            toast.success(`Selected range: ${startDate} to ${dateStr}`);
            onDateSelect(startDate, dateStr); // Send both dates back to parent
            setIsSelectingEndDate(false); // Reset the selecting state
            setIsModalOpen(false); // Close modal after selecting end date
        }
    };

    return (
        <>
            <ToastContainer />
            <Box p={3}>
                <Button variant="contained" color="secondary" sx={{ borderRadius: 2, px: 3 }} onClick={() => { setIsModalOpen(true); }}>
                    <CalendarToday /> Open Calendar
                </Button>
                {startDate && endDate && (
                    <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={2} boxShadow={1}>
                        <Typography variant="h6" color="primary">
                            Selected Dates: From {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}.
                        </Typography>
                    </Box>
                )}
            </Box>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box p={4} bgcolor="white" color="black" width={450} mx="auto" mt={10} borderRadius={3} boxShadow={3}>
                    <Typography variant="h6" textAlign="center" mb={2} color="primary">
                        {isSelectingEndDate ? "Select End Date" : "Select Start Date"}
                    </Typography>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        dateClick={handleDateClick}
                        height={350}
                        initialDate={today} // Set today's date as the default date in the calendar
                    />
                    <Button variant="contained" color="error" fullWidth sx={{ mt: 2, borderRadius: 2 }} onClick={() => setIsModalOpen(false)}>Close</Button>
                </Box>
            </Modal>
        </>
    );
};

export default Calendar;
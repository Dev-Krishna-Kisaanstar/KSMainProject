import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Typography, Button, Modal } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CalendarToday } from '@mui/icons-material';

const Calendar = ({ onDateSelect }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectingEndDate, setSelectingEndDate] = useState(false);

    useEffect(() => {
        if (startDate && endDate) {
            onDateSelect(startDate, endDate); // Callback to pass selected dates back to parent
        }
    }, [startDate, endDate, onDateSelect]);

    const handleDateClick = ({ dateStr }) => {
        const clickedDate = new Date(dateStr);
        if (clickedDate > new Date()) {
            return toast.error("Future dates are not allowed!");
        }

        if (!startDate || selectingEndDate) {
            if (!startDate) {
                setStartDate(dateStr);
                toast.info("Now select the end date.");
                setSelectingEndDate(true);
            } else {
                if (new Date(dateStr) < new Date(startDate)) {
                    toast.error("End date cannot be before start date!");
                    return;
                }
                setEndDate(dateStr);
                setSelectingEndDate(false);
                setIsModalOpen(false);
            }
        }
    };

    return (
        <>
            <ToastContainer />
            <Box p={3}>
                <Box display="flex" gap={2} mb={3} justifyContent="center">
                    <Button variant="contained" color="secondary" sx={{ borderRadius: 2, px: 3 }} onClick={() => setIsModalOpen(true)}>
                        <CalendarToday /> Calendar
                    </Button>
                </Box>
            </Box>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box p={4} bgcolor="white" color="black" width={450} mx="auto" mt={10} borderRadius={3} boxShadow={3}>
                    <Typography variant="h6" textAlign="center" mb={2} color="primary">
                        {selectingEndDate ? "Select End Date" : "Select Start Date"}
                    </Typography>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        dateClick={handleDateClick}
                        height={350}
                    />
                    <Button variant="contained" color="error" fullWidth sx={{ mt: 2, borderRadius: 2 }} onClick={() => setIsModalOpen(false)}>Close</Button>
                </Box>
            </Modal>
        </>
    );
};

export default Calendar;
// Calendar.js
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Typography, Button, Modal, Stack } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Today, CalendarToday } from '@mui/icons-material';

const Calendar = ({ onDateSelect }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDateClick = ({ dateStr }) => {
        const clickedDate = new Date(dateStr);

        if (clickedDate > new Date()) {
            return toast.error("Future dates are not allowed!");
        }

        if (!startDate) {
            setStartDate(new Date(clickedDate));
            toast.success(`Start date set to ${clickedDate.toLocaleDateString()}`);
        } else if (clickedDate >= startDate) {
            setEndDate(new Date(clickedDate));
            toast.success(`End date set to ${clickedDate.toLocaleDateString()}`);
            onDateSelect({
                start: startDate.toISOString().split('T')[0],
                end: clickedDate.toISOString().split('T')[0]
            });
        } else {
            toast.error("End date must be after start date!");
        }
    };

    // Helper for Today, Yesterday, Day Before Yesterday
    const selectQuickDate = (daysAgo) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        // Prevent selecting a future date (should never happen for 0,1,2 but just in case)
        if (date > new Date()) {
            return toast.error("Cannot select a future date!");
        }

        const isoDate = date.toISOString().split('T')[0];
        setStartDate(new Date(date));
        setEndDate(new Date(date));

        toast.success(`Selected ${date.toLocaleDateString()}`);
        onDateSelect({ start: isoDate, end: isoDate });
    };

    return (
        <>
            <ToastContainer />
            <Box p={2}>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => selectQuickDate(0)}
                        startIcon={<Today />}
                    >
                        Today
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => selectQuickDate(1)}
                    >
                        Yesterday
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => selectQuickDate(2)}
                    >
                        Day Before Yesterday
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        onClick={() => setIsModalOpen(true)}
                        startIcon={<CalendarToday />}
                    >
                        Calendar
                    </Button>
                </Stack>
            </Box>

            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box p={3} bgcolor="#333" color="white" width={400} mx="auto" mt={8} borderRadius={2}>
                    <Typography variant="h6" textAlign="center" gutterBottom>
                        Select a Date Range
                    </Typography>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        dateClick={handleDateClick}
                        height={300}
                    />
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default Calendar;

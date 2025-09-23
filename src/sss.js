import React, { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
    Paper,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const RoughTwo = () => {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleDateChange = (date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (dayjs(date).isBefore(startDate)) {
            setStartDate(date);
            setEndDate(null);
        } else {
            setEndDate(date);
            setTimeout(() => setOpen(false), 400);
        }
    };

    const renderCustomDay = (date, selectedDates, pickersDayProps) => {
        const isStart = startDate && dayjs(date).isSame(startDate, "day");
        const isEnd = endDate && dayjs(date).isSame(endDate, "day");
        const isInBetween =
            startDate && endDate && dayjs(date).isBetween(startDate, endDate, "day", "[]");

        return (
            <PickersDay
                {...pickersDayProps}
                sx={{
                    backgroundColor: isStart
                        ? "#ff385c"
                        : isEnd
                            ? "#ff385c"
                            : isInBetween
                                ? "#fde4ea"
                                : "transparent",
                    color: isStart || isEnd ? "#fff" : "inherit",
                    fontWeight: isStart || isEnd ? "bold" : "normal",
                    borderRadius: "50%",
                    "&:hover": {
                        backgroundColor: isStart || isEnd ? "#e31c5f" : "#fde4ea",
                    },
                }}
            />
        );
    };

    return (
        <Box textAlign="center" >
            <Button
                variant="outlined"
                sx={{
                    m: "0px auto",
                    py: 1.7,
                    bgcolor: "white",
                    width: "100%",
                    textAlign: "start"
                }}
                onClick={() => setOpen(true)}
            >
                Book your dates
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth sx={{ p: 0, m: 0 }}>

                <DialogContent sx={{ p: 0, m: 0 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item xs={12} sm={6}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        // padding: 2,
                                        borderRadius: "12px",
                                        boxShadow: 0,
                                        border: "1px solid grey"
                                    }}
                                >
                                    <Typography variant="subtitle1" textAlign="center" fontWeight="bold">
                                        Check-in Date
                                    </Typography>
                                    <StaticDatePicker
                                        displayStaticWrapperAs="desktop"
                                        value={startDate}
                                        onChange={(date) => handleDateChange(date)}
                                        defaultCalendarMonth={dayjs()}
                                        minDate={dayjs()}
                                        slotProps={{ actionBar: { actions: [] } }}
                                        renderDay={renderCustomDay}
                                    />
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        // padding: 2,
                                        borderRadius: "12px",
                                        boxShadow: 0,
                                        border: "1px solid grey"

                                    }}
                                >
                                    <Typography variant="subtitle1" textAlign="center" fontWeight="bold">
                                        Check-out Date
                                    </Typography>
                                    <StaticDatePicker
                                        displayStaticWrapperAs="desktop"
                                        value={endDate}
                                        onChange={(date) => handleDateChange(date)}
                                        defaultCalendarMonth={startDate ? dayjs(startDate) : dayjs().add(1, "month")}
                                        minDate={startDate || dayjs()}
                                        slotProps={{ actionBar: { actions: [] } }}
                                        renderDay={renderCustomDay}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => setOpen(false)}
                        sx={{
                            fontWeight: "bold",
                            borderColor: "#ff385c",
                            color: "#ff385c",
                            "&:hover": { backgroundColor: "#fde4ea", borderColor: "#e31c5f" },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RoughTwo;

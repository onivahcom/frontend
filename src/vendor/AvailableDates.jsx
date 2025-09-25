import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
    Box, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Radio, RadioGroup, FormControlLabel, FormGroup, Checkbox, Stack, Grid, Card, AppBar, Toolbar, IconButton, TextField
} from "@mui/material";
import { apiUrl, backendApi } from "../Api/Api";
import axios from "axios";
import { useLocation, useOutletContext } from "react-router-dom";
import Close from "@mui/icons-material/Close";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import dayjs from "dayjs";


const statusColors = {
    available: "#4CAF50", // Green
    booked: "#F44336", // Red
    waiting: "#FF9800", // Orange
};

const colors_Details = [
    { color: "green", label: "Available" },
    { color: "rgb(219, 241, 255)", label: "Today" },
    { color: "#FFC107", label: "Waiting" },
    { color: "#F44336", label: "Booked" },
];

const AvailableDates = () => {

    const { vendor } = useOutletContext();
    const location = useLocation();
    const businessNameFromState = location.state?.businessName;
    const CategoryFromState = location.state?.category
    const idFromState = location.state?.id


    const [events, setEvents] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedBusinessName, setSelectedBusinessName] = useState(null);


    const [categories, setCategories] = useState([]);
    const [pendingFinalSave, setPendingFinalSave] = useState(false);

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [availabilities, setAvailabilities] = useState([]);

    console.log(events);


    // Fetch requested services
    const fetchRequestedServices = async (email) => {
        try {
            const response = await fetch(`${apiUrl}/get/vendor-dashboard/services?email=${email}`);
            const data = await response.json();
            setCategories(data);
            if (businessNameFromState && CategoryFromState && idFromState) {
                setSelectedId(idFromState)
                setSelectedCategory(CategoryFromState);
                setSelectedBusinessName(businessNameFromState);
                setOpenCalendar(true);
                fetchCategoryDates(CategoryFromState, businessNameFromState);
            }

        } catch (error) {
            console.error("Error fetching requested services:", error);
        }
    };

    useEffect(() => {
        if (!openCalendar) return;

        // Push a new history state so that back button can be intercepted
        window.history.pushState({ dialogOpen: true }, "");

        const handlePopState = (e) => {
            if (openCalendar) {
                setOpenCalendar(false); // close dialog
                window.history.pushState(null, ""); // restore state
            }
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            if (openCalendar) window.history.back(); // clean up
        };
    }, [openCalendar, setOpenCalendar]);

    useEffect(() => {
        if (vendor) {
            fetchRequestedServices(vendor?.email);
        }
    }, [vendor]);

    useEffect(() => {

        if (pendingFinalSave) {
            // Delay slightly to ensure state is synced
            const timer = setTimeout(() => {
                handleFinalSave();
                setPendingFinalSave(false); // Reset
            }, 100); // Short timeout is usually enough

            return () => clearTimeout(timer); // Clean up on unmount
        }
    }, [pendingFinalSave, events]);

    const handleRadioChange = (category, businessName, id) => {
        setSelectedCategory(category);
        setSelectedId(id);
        setSelectedBusinessName(businessName);
        setOpenCalendar(true);
        fetchCategoryDates(category, businessName);
    };

    const fetchCategoryDates = async (category, businessName) => {
        try {
            const response = await backendApi.get(`/get-category-dates`, {
                params: { category, businessName, email: vendor?.email },
            });

            const { booked = [], waiting = [], available = [] } = response.data;

            const formattedEvents = [
                ...booked.map(date => ({ title: "Booked", start: date, color: "red" })),
                ...waiting.map(date => ({ title: "Waiting", start: date, color: "orange" })),
                ...available.map(date => ({ title: "Available", start: date, color: "green" }))
            ];

            setEvents(prev => ({ ...prev, [category]: formattedEvents }));

        } catch (error) {
            console.error("Error fetching category dates:", error.response?.data || error.message);
        }
    };

    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);
        setOpenDialog(true);
    };

    const handleSaveEvent = () => {
        if (!selectedStatus || !selectedCategory) return;

        setEvents((prevEvents) => {
            const updatedEvents = { ...prevEvents };
            updatedEvents[selectedCategory] = [
                ...(updatedEvents[selectedCategory] || []).filter(event => event.start !== selectedDate),
                {
                    title: selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1),
                    start: selectedDate,
                    businessName: selectedBusinessName,
                    email: vendor?.email
                },
            ];
            return updatedEvents;
        });

        setOpenDialog(false);
        setSelectedStatus("");
        setPendingFinalSave(true);  // ✅ Trigger save after state update
    };


    const handleAddAvailability = () => {
        if (!fromDate || !toDate) {
            console.error("Both From and To dates are required");
            return;
        }

        // Generate all dates between fromDate and toDate
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const temp = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            temp.push({
                title: "Available",
                start: new Date(d).toISOString().split("T")[0], // YYYY-MM-DD format
                allDay: true,
            });
        }

        // Merge into existing events
        setEvents((prev) => ({
            ...prev,
            [selectedCategory]: [
                ...(prev[selectedCategory] || []),
                ...temp,
            ],
        }));

        // Reset fields
        setFromDate(null);
        setToDate(null);

        // Call final save immediately
        handleFinalSave([...(events[selectedCategory] || []), ...temp]);
    };

    const handleFinalSave = async (customEvents) => {

        const finalEvents = customEvents || events[selectedCategory];

        if (!selectedCategory || !selectedBusinessName || !finalEvents.length) {
            console.log("Missing required fields:", { selectedCategory, selectedBusinessName, events });
            return;
        }

        // Construct the categorized dates (booked, waiting, available)
        const categorizedDates = {
            booked: [],
            waiting: [],
            available: []
        };

        finalEvents.forEach(event => {
            if (event.title.toLowerCase() === "booked") {
                categorizedDates.booked.push(event.start);
            } else if (event.title.toLowerCase() === "waiting") {
                categorizedDates.waiting.push(event.start);
            } else if (event.title.toLowerCase() === "available") {
                categorizedDates.available.push(event.start);
            }
        });

        try {
            const response = await backendApi.put(`/update-category-dates`, {
                category: selectedCategory,
                businessName: selectedBusinessName,
                dates: categorizedDates, // Sending categorized dates
                email: vendor?.email
            });


            setOpenCalendar(false);
            setSelectedCategory(null);
            setSelectedBusinessName(null);
        } catch (error) {
            console.log("Error updating category dates:", error.response?.data || error.message);
        }
    };

    return (

        <Box sx={{ maxWidth: 1000, mx: "auto", mt: 3, p: { xs: 1, md: 2 } }}>
            <Paper elevation={0} sx={{ p: 2, textAlign: "left", mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">Manage Availability</Typography>
                <Typography variant="body1" color="text.secondary">
                    Select a category to schedule availability.
                </Typography>
            </Paper>

            {/* Category Selection Grid (unchanged) */}
            <Grid container spacing={2} p={{ xs: 1, md: 4 }}>
                {categories.map(({ category, businessName, _id, coverImage }) => {
                    const formattedCategory = category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                    return (
                        <Grid item xs={12} sm={6} md={4} key={_id}>
                            <Card
                                variant="outlined"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    border: selectedId === String(_id) ? "2px solid #7b55aa" : "1px solid #e0e0e0",
                                    borderRadius: 2,
                                    p: 1,
                                    transition: "0.25s",
                                    "&:hover": { bgcolor: "#f8f8f8" },
                                }}
                                onClick={() => {
                                    handleRadioChange(category, businessName, _id);
                                    setOpenCalendar(true); // open fullscreen dialog
                                }}
                            >
                                {coverImage ? (
                                    <Box component="img" src={coverImage} alt={formattedCategory} sx={{ width: 60, height: 60, borderRadius: 1, objectFit: "cover", mr: 2 }} />
                                ) : (
                                    <Box sx={{ width: 60, height: 60, borderRadius: 1, bgcolor: "grey.300", mr: 2 }} />
                                )}
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1, justifyContent: "space-between" }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {/* {formattedCategory}  */}
                                        {businessName || "N/A"}
                                    </Typography>
                                    <Radio size="small" checked={selectedId === String(_id)} onChange={() => handleRadioChange(category, businessName, _id)} sx={{ ml: "auto" }} />
                                </Stack>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Fullscreen Calendar Dialog */}
            <Dialog
                fullScreen
                open={openCalendar}
                onClose={() => setOpenCalendar(false)}
            >
                <AppBar elevation={0} sx={{ position: "relative", bgcolor: "#f8f8f8" }}>
                    <Toolbar sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography
                            sx={{
                                // ml: 2,
                                flex: 1,
                                color: "#333", // dark gray instead of pure black for softer look
                                fontWeight: 600, // slightly bolder
                                letterSpacing: 0.5,
                                fontSize: { xs: 18, sm: 20, md: 22 }, // responsive size
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                            variant="h6"
                            component="div"
                        >
                            <Typography variant="h6" component="span" >{selectedBusinessName}</Typography>
                        </Typography>


                        <IconButton edge="start" color="default" onClick={() => setOpenCalendar(false)} aria-label="close">
                            <Close />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* set availability */}
                <Stack
                    maxWidth='sm'
                    mx='auto'
                    spacing={3}
                    mb={3}
                    sx={{
                        p: 2,
                        // border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        // bgcolor: "#fafafa"
                    }}
                >
                    <>
                        {/* <Typography variant="body2" component='div' fontWeight={600}>
                            Set Your Availability
                        </Typography> */}
                        <Typography variant="body2" color="text.secondary">
                            Select a <strong>From Date</strong> and <strong>To Date</strong> to mark when you are available.
                            These dates will appear in your calendar.
                        </Typography>
                    </>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <DatePicker
                                label="From Date"
                                value={fromDate}
                                onChange={(newValue) => setFromDate(newValue)}
                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                                disablePast
                            />

                            <DatePicker
                                sx={{ borderColor: "grey !important" }}
                                label="To Date"
                                value={toDate}
                                onChange={(newValue) => setToDate(newValue)}
                                slotProps={{ textField: { size: "small", fullWidth: true } }}
                                disablePast
                            />

                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleAddAvailability}
                                sx={{ px: 3, py: 1.2, textTransform: "none" }}
                            >
                                Set
                            </Button>
                        </Stack>
                    </LocalizationProvider>
                </Stack>

                {/* colors description */}
                <Stack direction="row" spacing={3} sx={{ width: "100%", justifyContent: "center", p: 1, }}>
                    {colors_Details.map((cat, index) => (
                        <Stack key={index} direction="row" spacing={1} alignItems="center">
                            <Box
                                sx={{
                                    width: 16,
                                    height: 16,
                                    backgroundColor: cat.color,
                                    borderRadius: 2,
                                }}
                            />
                            <Typography variant="caption">{cat.label}</Typography>
                        </Stack>
                    ))}
                </Stack>

                <Box sx={{ p: 2, }} maxWidth='md' mx='auto'>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{ start: "prev,next", center: "title", end: "dayGridMonth,dayGridWeek" }}
                        dateClick={handleDateClick}
                        events={[...(events[selectedCategory] || []), ...availabilities]}
                        // events={events[selectedCategory] || []}
                        height="auto"
                        validRange={
                            fromDate && toDate
                                ? { start: fromDate, end: toDate }
                                : { start: new Date().toISOString().split("T")[0] }
                        }
                    />
                </Box>
            </Dialog>

            {/* Dialog remains unchanged */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle>Select Status for {selectedDate}</DialogTitle>
                <DialogContent>
                    <RadioGroup value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                        {Object.keys(statusColors).map((status) => (
                            <FormControlLabel
                                key={status}
                                value={status}
                                control={<Radio sx={{ color: statusColors[status] }} />}
                                label={status.charAt(0).toUpperCase() + status.slice(1)}
                            />
                        ))}
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleSaveEvent} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Box >

    );
};

export default AvailableDates;

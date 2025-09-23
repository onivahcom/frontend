import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    TextField,
    Typography,
    Divider,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DateRange } from "react-date-range";
import dayjs from "dayjs";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import LocationOn from "@mui/icons-material/LocationOn";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { CalendarMonth, NavigateNext } from "@mui/icons-material";

const CheckinMenu = ({ onDateSelect, defaultDates }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [open, setOpen] = useState(false);
    const [range, setRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: "selection",
        },
    ]);


    useEffect(() => {
        if (defaultDates && defaultDates.length > 0) {
            const start = dayjs(defaultDates[0]).toDate();
            const end = dayjs(defaultDates[defaultDates.length - 1]).toDate();
            setRange([{ startDate: start, endDate: end, key: "selection" }]);
        }
    }, [defaultDates]);

    const formatDate = (date) =>
        date ? dayjs(date).format("DD MMM YYYY") : "--";

    const nights =
        range[0].startDate && range[0].endDate
            ? dayjs(range[0].endDate).diff(dayjs(range[0].startDate), "day")
            : 0;

    return (
        <>
            {/* Input trigger */}
            <Box
                onClick={() => setOpen(true)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minWidth: 220,                // minimum size
                    width: { xs: "100%", sm: "auto" }, // full width on mobile, auto on larger
                    px: 2.5,
                    py: 1.5,
                    // mr: 2,
                    borderRadius: 2,
                    bgcolor: "white",
                    cursor: "pointer",
                    border: "1.5px solid #eeee",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        bgcolor: "#f5f5f5",
                        borderColor: "grey",
                    },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "nowrap" }}>
                    <CalendarMonth sx={{ color: "#555", fontSize: 14, flexShrink: 0 }} />

                    {range[0].startDate && range[0].endDate ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexWrap: "nowrap" }}>
                            <Typography
                                variant="body2"
                                sx={{ color: "#333", whiteSpace: "nowrap" }}
                            >
                                {formatDate(range[0].startDate)}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "#333", whiteSpace: "nowrap" }}
                            >
                                →
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "#333", whiteSpace: "nowrap" }}
                            >
                                {formatDate(range[0].endDate)}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body2" sx={{ color: "#333", whiteSpace: "nowrap" }}>
                            Select Dates
                        </Typography>
                    )}
                </Box>

                <ArrowDropDown sx={{ color: "#555", fontSize: 14 }} />
            </Box>



            {/* Dialog */}
            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);

                    const { startDate, endDate } = range[0];
                    if (startDate && endDate) {
                        let allDates = [];
                        let current = dayjs(startDate);
                        let end = dayjs(endDate);
                        while (current.isBefore(end, "day") || current.isSame(end, "day")) {
                            allDates.push(current.format("YYYY-MM-DD"));
                            current = current.add(1, "day");
                        }
                        onDateSelect(allDates); // 👈 sync even if Save not clicked
                    }
                }}
                fullScreen={isMobile}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pb: 1,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Select your stay dates
                    </Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />

                <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
                    {/* Header with Check-in / Check-out */}
                    <Box
                        display="flex"
                        justifyContent="space-around"
                        alignItems="center"
                        mb={3}
                        sx={{ gap: 3 }}
                    >
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "#f5f5f5",
                                borderRadius: 2,
                                flex: 1,
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="subtitle2" color="text.secondary">
                                Check-in
                            </Typography>
                            <Typography variant="h6">
                                {formatDate(range[0].startDate)}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                p: 2,
                                bgcolor: "#f5f5f5",
                                borderRadius: 2,
                                flex: 1,
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="subtitle2" color="text.secondary">
                                Check-out
                            </Typography>
                            <Typography variant="h6">
                                {formatDate(range[0].endDate)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Nights */}
                    {nights > 0 && (
                        <Typography
                            align="center"
                            color="primary"
                            fontWeight="bold"
                            mb={2}
                        >
                            {nights} {nights === 1 ? "night" : "nights"}
                        </Typography>
                    )}

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        mb={3}
                        sx={{ gap: 3 }}
                        className='search_date'
                    >

                        {/* Calendar */}
                        <DateRange
                            ranges={
                                range[0].startDate && range[0].endDate
                                    ? range // normal range when user selects or defaultDates exist
                                    : [
                                        {
                                            startDate: new Date(0), // epoch
                                            endDate: new Date(0),   // same day → so no visible highlight
                                            key: "selection",
                                        },
                                    ]
                            }
                            onChange={(item) => setRange([item.selection])}
                            moveRangeOnFirstSelection={false}
                            retainEndDateOnFirstSelection={true}
                            minDate={new Date()}
                            rangeColors={["#ff385c"]}
                            direction={isMobile ? "vertical" : "horizontal"}
                            months={isMobile ? 1 : 2}
                            showDateDisplay={false}
                            shownDate={new Date()}   // 👈 always open at current month if nothing is selected

                        />

                    </Box>
                    {/* Save button */}
                    <Box textAlign="right" mt={3}>
                        <Button
                            endIcon={<NavigateNext />}
                            variant="text"
                            sx={{ borderRadius: "30px", px: 4 }}
                            onClick={() => setOpen(false)}
                            disabled={!range[0].startDate || !range[0].endDate}
                        >
                            Done
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CheckinMenu;

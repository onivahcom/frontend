// import React, { useEffect, useState } from 'react';
// import { Box, IconButton, Stack, Typography, Tooltip, Select, MenuItem, ListItemIcon, Divider, InputLabel, FormControl, ListItemText } from '@mui/material';
// import CategoryIcon from '@mui/icons-material/Category';
// import EventIcon from '@mui/icons-material/Event';
// import HomeWorkIcon from '@mui/icons-material/HomeWork';
// import BeachAccessIcon from '@mui/icons-material/BeachAccess';
// import AgricultureIcon from '@mui/icons-material/Agriculture';
// import BusinessIcon from '@mui/icons-material/Business';
// import TempleHinduIcon from '@mui/icons-material/TempleHindu';
// import CameraAltIcon from '@mui/icons-material/CameraAlt';
// import PaletteIcon from '@mui/icons-material/Palette';
// import GroupIcon from '@mui/icons-material/Group';
// import { useNavigate } from 'react-router-dom';
// import { DrawOutlined, FoodBank } from '@mui/icons-material';

// const CategoryMenu = ({ onCategorySelect, defaultCategory }) => {

//     const navigate = useNavigate();

//     useEffect(() => {
//         setselectedCategory(defaultCategory);
//     }, [defaultCategory]);

//     const [selectedCategory, setselectedCategory] = useState(defaultCategory); // State to store the selected location

//     const handleChange = (event) => {
//         const category = event.target.value;
//         setselectedCategory(category); // Set the selected category
//         onCategorySelect(category); // Call the provided function with the new category
//     };

//     const menuItems = [
//         { text: 'wedding_hall', icon: <HomeWorkIcon fontSize="small" /> },
//         { text: 'party_hall', icon: <EventIcon fontSize="small" /> },
//         { text: 'beach_wedding', icon: <BeachAccessIcon fontSize="small" /> },
//         { text: 'farm_land', icon: <AgricultureIcon fontSize="small" /> },
//         { text: 'convention_center', icon: <BusinessIcon fontSize="small" /> },
//         { text: 'mandabam', icon: <TempleHinduIcon fontSize="small" /> },
//         { text: 'photography', icon: <CameraAltIcon fontSize="small" /> },
//         { text: 'catering', icon: <FoodBank fontSize="small" /> },
//         { text: 'decors', icon: <PaletteIcon fontSize="small" /> },
//         { text: 'event_planners', icon: <GroupIcon fontSize="small" /> },
//         { text: 'mehandi', icon: <DrawOutlined fontSize="small" /> }

//     ];



//     return (
//         <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', backgroundColor: "white", borderRadius: 2 }}>
//             <FormControl fullWidth variant="outlined" >
//                 <InputLabel>Choose your event</InputLabel>
//                 <Select
//                     label="Choose your event"
//                     value={selectedCategory || ''}
//                     onChange={handleChange}
//                     sx={{

//                         '& .MuiSelect-select': {
//                             display: 'flex',
//                             alignItems: 'center',
//                         },
//                     }}
//                 >
//                     {menuItems.map((item, index) => (
//                         <MenuItem
//                             key={index}
//                             value={item.text}
//                             // onClick={() => navigate(`/service${item.link}`)} // Navigate to /service/menulink
//                             sx={{ display: "flex", alignItems: "center", gap: 1 }} // Ensures proper alignment
//                         >
//                             <ListItemIcon sx={{ minWidth: "30px", color: "primary.main" }}>
//                                 {item.icon}
//                             </ListItemIcon>
//                             <ListItemText primary={item.text.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase())} />

//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>
//         </Box>
//     );
// };

// export default CategoryMenu;


import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    IconButton,
    Button,
    Paper,
    TextField,
    Tooltip,
    Slide,
    useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import EventIcon from "@mui/icons-material/Event";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import BusinessIcon from "@mui/icons-material/Business";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import PaletteIcon from "@mui/icons-material/Palette";
import GroupIcon from "@mui/icons-material/Group";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import { formatCategory } from './RemoveUnderscore';
import { RoomService } from "@mui/icons-material";
import { useEffect } from "react";
import theme from "../Themes/theme";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CategoryMenu = ({ onCategorySelect, defaultCategory }) => {

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filter, setFilter] = useState("");


    useEffect(() => {
        if (defaultCategory) {
            setSelectedCategory(defaultCategory);
        }
    }, [defaultCategory]);


    const menuItems = [
        { text: "wedding_hall", icon: <HomeWorkIcon fontSize="small" />, badge: "New" },
        { text: "party_hall", icon: <EventIcon fontSize="small" /> },
        { text: "beach_wedding", icon: <BeachAccessIcon fontSize="small" /> },
        { text: "farm_land", icon: <AgricultureIcon fontSize="small" /> },
        { text: "convention_center", icon: <BusinessIcon fontSize="small" /> },
        { text: "mandabam", icon: <TempleHinduIcon fontSize="small" /> },
        { text: "photography", icon: <CameraAltIcon fontSize="small" /> },
        { text: "catering", icon: <FoodBankIcon fontSize="small" /> },
        { text: "decors", icon: <PaletteIcon fontSize="small" /> },
        { text: "event_planners", icon: <GroupIcon fontSize="small" /> },
        { text: "mehandi", icon: <DrawOutlinedIcon fontSize="small" /> },
    ];

    const filteredItems = menuItems.filter(item =>
        item.text.toLowerCase().includes(filter.toLowerCase())
    );

    const handleSelect = (item) => {
        setSelectedCategory(item.text);
        setOpen(false);
        onCategorySelect?.(item.text);
    };

    return (
        <>

            <Box
                onClick={() => setOpen(true)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minWidth: 220,                // minimum size
                    width: { xs: "100%", sm: 220 }, // full width on mobile, auto on larger
                    px: 2.5,
                    py: 1.5,
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <RoomService sx={{ color: "#555", fontSize: 14 }} />
                    <Typography variant="body2" sx={{ color: "#333" }}>
                        {selectedCategory ? formatCategory(selectedCategory) : "Select Category"}
                    </Typography>
                </Box>
                <ArrowDropDownIcon sx={{ color: "#555", fontSize: 14 }} />
            </Box>

            {/* Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                fullScreen={isMobile}
                maxWidth="md"
                TransitionComponent={Transition}
                PaperProps={{ sx: { borderRadius: 4, overflow: "hidden", backgroundColor: "#fafafa" } }}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        borderBottom: "1px solid #eee",
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Choose a Category
                    </Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 2 }}>
                    {/* Search Input */}
                    <TextField
                        placeholder="Search categories..."
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ mb: 2, maxWidth: 300 }}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />

                    {/* Categories Grid */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                            gap: 2,
                        }}
                    >
                        {filteredItems.map((item, idx) => (
                            <Paper
                                key={item.text}
                                elevation={0}
                                onClick={() => handleSelect(item)}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: selectedCategory === item.text ? "royalblue" : "#fff",
                                    color: selectedCategory === item.text ? "#fff" : "#333",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    border: '1px solid white',
                                    "&:hover": {
                                        bgcolor: "#f4edff",
                                        color: "black",
                                        border: '1px solid #f4edff',
                                        boxShadow: 0,
                                    },
                                    textTransform: "capitalize",
                                    position: "relative",
                                }}
                            >
                                <IconButton
                                    sx={{
                                        bgcolor: "#f8f8f8",
                                        borderRadius: 3, // gives a soft rounded look
                                        p: 1.5, // padding inside the button
                                        "& svg": { transition: "all 0.3s ease", fontSize: 28 },
                                        "&:hover": {
                                            bgcolor: "#ffff",
                                        },
                                        "&:hover svg": {
                                            transform: "rotate(15deg) scale(1.2)",
                                        },
                                    }}
                                >
                                    {item.icon}
                                </IconButton>

                                {item.badge && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 6,
                                            right: 6,
                                            bgcolor: "primary.main",
                                            color: "#fff",
                                            borderRadius: 3,
                                            px: 0.7,
                                            fontSize: 10,
                                        }}
                                    >
                                        {item.badge}
                                    </Box>
                                )}
                                <Typography variant="caption" sx={{ mt: 1, fontWeight: 500 }}>
                                    {formatCategory(item.text)}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
export default CategoryMenu;

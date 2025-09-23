import React, { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    IconButton,
    CircularProgress,
    Divider,
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Stack, Chip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { apiUrl, backendApi } from "../Api/Api";
import { useLocation, useNavigate } from "react-router-dom";

const SUGGESTIONS = ["Mandabam", "Decors", "Photography"]; // 🔹 Chip Suggestions

const ListingServiceCount = ({ color }) => {

    const inputRef = useRef(null); // 🔹 Ref for TextField
    const navigate = useNavigate(); // ✅ Initialize navigate


    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100); // Small delay ensures it's fully rendered
        }
    }, [open]);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length > 2) {
                setLoading(true);
                try {
                    const response = await backendApi.get(`/list/services?q=${query}`);

                    setResults(response.data);
                } catch (error) {
                    console.error("Error fetching search results", error);
                    setResults([]);
                }
                setLoading(false);
            } else {
                setResults([]);
            }
        };

        const delayDebounce = setTimeout(fetchResults, 500);
        return () => clearTimeout(delayDebounce);
    }, [query]);

    const handleChipClick = (suggestion) => {
        setQuery(suggestion); // 🔹 Sets the query
    };

    return (
        <>
            <IconButton onClick={() => setOpen(true)} >
                <SearchIcon fontSize="small" sx={{ fontWeight: 700, color: 'grey' }} />
            </IconButton>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Search Services</Typography>
                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Divider />

                <DialogContent>
                    <TextField
                        inputRef={inputRef} // 🔹 Set ref to TextField
                        fullWidth
                        variant="outlined"
                        label="Search for a venue"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                        sx={{ mt: 2, mb: 3 }}
                    />
                    {/* 🔹 Chips for Suggested Searches */}
                    <Stack spacing={1} sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            🔹 Try searching for:
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1.5, // More space between chips
                            }}
                        >
                            {SUGGESTIONS.map((suggestion, index) => (
                                <Chip
                                    key={index}
                                    label={suggestion}
                                    onClick={() => handleChipClick(suggestion)}
                                    variant="filled"
                                    sx={{
                                        fontWeight: 500,
                                        borderRadius: "8px", // Smooth rounded edges
                                        padding: "6px 12px",
                                    }}
                                />
                            ))}
                        </Box>
                    </Stack>

                    {loading && (
                        <Box display="flex" justifyContent="center" mt={2}>
                            <CircularProgress />
                        </Box>
                    )}

                    {!loading && results.length === 0 && query.length > 2 && (
                        <Typography textAlign="center" color="text.secondary" mt={2}>
                            No results found.
                        </Typography>
                    )}

                    {/* ✅ Grid Layout for Cards */}
                    <Grid container spacing={3} mt={3}>
                        {results.map((item, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Card
                                    onClick={() => navigate(`/service/${item._id}`)}
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        cursor: "pointer",
                                        transition: "box-shadow 0.2s ease",
                                        "&:hover": {
                                            boxShadow: 4,
                                            borderRadius: 3,
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={item.image || `https://picsum.photos/id/${index + 1}/5000/3333`}
                                        alt={item._id}
                                        sx={{
                                            objectFit: "cover",
                                            borderTopLeftRadius: "12px",
                                            borderTopRightRadius: "12px",
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={600}
                                            gutterBottom
                                            sx={{ textTransform: "capitalize" }}
                                        >
                                            {item._id.replace(/_/g, " ")}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            Services Available: <strong>{item.count}</strong>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                </DialogContent>
            </Dialog>
        </>
    );
};

export default ListingServiceCount;

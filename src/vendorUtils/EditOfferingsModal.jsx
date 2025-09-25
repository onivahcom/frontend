import { useState, useEffect } from 'react';
import {
    Box, Button, Paper, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Divider, IconButton
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Card } from '@mui/material';
import Close from '@mui/icons-material/Close';

const EditOfferingsModal = ({ open, handleClose, initialValue = [], onSave }) => {

    const [pricings, setPricings] = useState([]);

    useEffect(() => {
        if (Array.isArray(initialValue)) setPricings(initialValue);
    }, [initialValue]);

    // Handle field change
    const handleChange = (index, key, value) => {
        const updated = [...pricings];
        updated[index][key] = key === "price" ? Number(value) : value;
        setPricings(updated);
    };

    // Add new offering
    const handleAddOffering = () => {
        setPricings([...pricings, { title: '', description: '', price: 0 }]);
    };

    // Remove offering
    const handleRemoveOffering = (index) => {
        setPricings(pricings.filter((_, i) => i !== index));
    };

    // Save handler
    const handleSave = () => onSave(pricings);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            fullScreen
            maxWidth="md"
            PaperProps={{ sx: { borderRadius: 3, p: 0 } }}
        >

            <DialogTitle sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {/* First row: Title + Close Icon */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">Edit Offerings</Typography>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Box>

                {/* Second row: Add Field button */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleAddOffering}
                    >
                        Add
                    </Button>
                </Box>
            </DialogTitle>


            <DialogContent>
                <Box sx={{ my: 2 }}>
                    <Grid container spacing={2} mt={1}>
                        {[...pricings].slice().reverse().map((field, revIndex) => {
                            const actualIndex = pricings.length - 1 - revIndex;
                            return (
                                <Grid item xs={12} key={actualIndex}>
                                    <Card sx={{ p: 1, boxShadow: 0 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            {/* Title */}
                                            <Grid item xs={12} sm={4} md={3}>
                                                <TextField
                                                    label="Title"
                                                    value={field.title}
                                                    fullWidth
                                                    size="small"
                                                    onChange={(e) =>
                                                        handleChange(actualIndex, "title", e.target.value)
                                                    }
                                                />
                                            </Grid>

                                            {/* Description */}
                                            <Grid item xs={12} sm={6} md={6}>
                                                <TextField
                                                    label="Description"
                                                    value={field.description}
                                                    fullWidth
                                                    size="small"
                                                    multiline
                                                    minRows={1}
                                                    onChange={(e) =>
                                                        handleChange(actualIndex, "description", e.target.value)
                                                    }
                                                />
                                            </Grid>

                                            {/* Price */}
                                            <Grid item xs={12} sm={4} md={2}>
                                                <TextField
                                                    label="Price (₹)"
                                                    type="number"
                                                    value={field.price}
                                                    fullWidth
                                                    size="small"
                                                    onChange={(e) =>
                                                        handleChange(actualIndex, "price", e.target.value)
                                                    }
                                                />
                                            </Grid>

                                            {/* Delete Button */}
                                            <Grid
                                                item
                                                xs={12}
                                                sm={2}
                                                md={1}
                                                sx={{ display: "flex", justifyContent: { xs: "flex-end", sm: "center" } }}
                                            >
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveOffering(actualIndex)}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>

                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditOfferingsModal;

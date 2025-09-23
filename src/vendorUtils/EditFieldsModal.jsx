import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Paper,
    Grid,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Chip,
    Autocomplete,
    Typography,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import theme from "../Themes/theme";
import { useMediaQuery } from "@mui/material";

const EditFieldsModal = ({ open, handleClose, initialValue = [], onSave }) => {

    const [fields, setFields] = useState([]);
    console.log(initialValue);
    useEffect(() => {
        if (Array.isArray(initialValue)) setFields(initialValue);
    }, [initialValue]);

    const handleAddCustomField = () => {
        setFields([...fields, { name: "", type: "text", value: "" }]);
    };

    const handleFieldChange = (index, key, value) => {
        const updated = [...fields];
        updated[index][key] = value;
        // Reset value if type changes
        if (key === "type") {
            updated[index].value = value === "list" ? [] : value === "mixed" ? { text: "", list: [] } : "";
        }
        setFields(updated);
    };

    const handleDelete = (index) => {
        const updated = [...fields];
        updated.splice(index, 1);
        setFields(updated);
    };

    const handleSave = () => onSave(fields);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg" PaperProps={{ sx: { borderRadius: 3, p: 2 } }}>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Edit Fields
                <Button variant="outlined" onClick={handleAddCustomField}>
                    Add Field
                </Button>
            </DialogTitle>
            <DialogContent>


                {fields.map((field, index) => (
                    <Paper elevation={0} key={index} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    fullWidth
                                    label="Heading"
                                    value={field.name}
                                    onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        label='Type'
                                        value={field.type}
                                        onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                                    >
                                        <MenuItem value="text">Text</MenuItem>
                                        <MenuItem value="list">List</MenuItem>
                                        <MenuItem value="mixed">Mixed</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={5}>
                                {field.type === "text" && (
                                    <TextField
                                        fullWidth
                                        multiline
                                        label="Value"
                                        value={field.value}
                                        onChange={(e) => handleFieldChange(index, "value", e.target.value)}
                                    />
                                )}

                                {field.type === "list" && (
                                    <Autocomplete
                                        multiple
                                        freeSolo
                                        options={[]}
                                        value={Array.isArray(field.value) ? field.value : []}
                                        onChange={(event, newValue) =>
                                            handleFieldChange(
                                                index,
                                                "value",
                                                newValue.map((v) => v.trim()).filter(Boolean)
                                            )
                                        }
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, idx) => (
                                                <Chip key={idx} label={option} {...getTagProps({ index: idx })} />
                                            ))
                                        }
                                        renderInput={(params) => <TextField {...params} label="List Items" />}
                                    />
                                )}

                                {field.type === "mixed" && (
                                    <Box>
                                        <TextField
                                            fullWidth
                                            label="Text Part"
                                            value={field.value?.text || ""}
                                            onChange={(e) =>
                                                handleFieldChange(index, "value", { ...field.value, text: e.target.value })
                                            }
                                            sx={{ mb: 1 }}
                                        />
                                        <Autocomplete
                                            multiple
                                            freeSolo
                                            options={[]}
                                            value={Array.isArray(field.value?.list) ? field.value.list : []}
                                            onChange={(event, newValue) =>
                                                handleFieldChange(index, "value", {
                                                    ...field.value,
                                                    list: newValue.map((v) => v.trim()).filter(Boolean),
                                                })
                                            }
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, idx) => (
                                                    <Chip key={idx} label={option} {...getTagProps({ index: idx })} />
                                                ))
                                            }
                                            renderInput={(params) => <TextField {...params} label="List Items" />}
                                        />
                                    </Box>
                                )}


                            </Grid>

                            <Grid item xs={12} sm={1} sx={{ textAlign: "right" }}>
                                <IconButton onClick={() => handleDelete(index)}>
                                    <Delete sx={{ color: "grey" }} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditFieldsModal;

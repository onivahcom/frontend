import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";

const EditDescriptionModal = ({ open, handleClose, initialValue, onSave }) => {
    const [value, setValue] = useState(initialValue || "");


    useEffect(() => {
        setValue(initialValue || ""); // update if initialValue changes
    }, [initialValue]);

    const handleSave = () => {
        onSave(value);
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: 3, p: 2 }
            }}
        >
            <DialogTitle>Edit Description</DialogTitle>

            <DialogContent>
                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDescriptionModal;

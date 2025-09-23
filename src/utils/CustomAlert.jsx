import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Box, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CustomAlert = ({ openInitially, onClose, severity = "info", icon, title, message }) => {
    const [open, setOpen] = useState(openInitially);

    // Close alert automatically after 2 seconds
    useEffect(() => {
        if (openInitially) {
            const timer = setTimeout(() => {
                setOpen(false);
                if (onClose) onClose(); // Call onClose callback (optional)
            }, 2000);

            return () => clearTimeout(timer); // Clear timer if component unmounts
        }
    }, [openInitially, onClose]);

    return (
        <Box my={2}>
            <Collapse in={open} timeout={500}> {/* Slow down collapse transition */}
                <Alert
                    severity={severity}
                    icon={icon}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setOpen(false)}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{
                        alignItems: 'center',
                        borderRadius: 2,
                        boxShadow: 0,
                        px: 2,
                        py: 1.5,
                    }}
                >
                    {title && <AlertTitle>{title}</AlertTitle>}
                    {message}
                </Alert>
            </Collapse>
        </Box>
    );
};

export default CustomAlert;

import { createTheme } from '@mui/material/styles';

// Define your custom theme
const theme = createTheme({
    palette: {
        primary: {
            main: "#6D4D94"
            // main: "#704d8f" // Primary color
        },
        secondary: {
            main: '#B692C0' // Secondary color
        },
    },
    typography: {
        fontFamily: '"Poppins", sans-serif !important', // Set font family for all text
    },
    components: {
        // Customize MUI components
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    fontFamily: '"Poppins", sans-serif !important',
                    // fontWeight: "300"
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10 // Set border radius for buttons
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                },
                outlined: {
                    borderRadius: 10,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: 10, // Set border radius for TextFields

                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10, // Set border radius for TextFields
                        // fontWeight: "300"
                    },
                },
            },
        },
    },
});

export default theme;

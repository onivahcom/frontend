import { Box, Typography, Grid, Paper, Chip } from "@mui/material";

const dummyFields = [
    {
        name: "Wedding Cost",
        value: "₹40,000 – Includes hall, decoration, and lights",
        type: "text"
    },
    {
        name: "Photography Package",
        value: [
            "₹15,000 Total",
            "Candid Photoshoot",
            "Traditional Coverage",
            "Custom Album Design"
        ],
        type: "list"
    },
    {
        name: "DJ/Music",
        value: [
            "₹5,000 for 3 hours",
            "Professional DJ",
            "Lighting & Sound Setup",
            "Can accept custom playlist"
        ],
        type: "mixed"
    }
];



const CustomFieldsDemo = () => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight={500} sx={{ mb: 2 }}>
                Vendor's Offerings
            </Typography>

            <Grid container spacing={2}>
                {dummyFields.map((field, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: "1px solid #ddd",
                                background: "#f9f9f9",
                                borderRadius: 2,
                                height: "100%",
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Type Badge */}
                            <Chip
                                label={`type: ${field.type}`}
                                size="small"
                                color="primary"
                                sx={{ position: "absolute", top: 2, right: 0 }}
                            />

                            {/* Name */}
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                {field.name}
                            </Typography>

                            {/* Content */}
                            <Box sx={{ flexGrow: 1 }}>
                                {field.type === "text" && (
                                    <Typography variant="body2" color="text.secondary">
                                        {field.value}
                                    </Typography>
                                )}

                                {field.type === "list" && (
                                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                                        {field.value.map((item, i) => (
                                            <li key={i}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item}
                                                </Typography>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {field.type === "mixed" && (
                                    <>
                                        <Typography variant="body2" color="text.secondary">
                                            {field.value[0]}
                                        </Typography>
                                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                                            {field.value.slice(1).map((item, i) => (
                                                <li key={i}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item}
                                                    </Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CustomFieldsDemo;
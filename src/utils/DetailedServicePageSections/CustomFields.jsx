import { Box, Card, Chip, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, TextField, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import theme from '../../Themes/theme';
import { Done, FiberManualRecord } from '@mui/icons-material';
import CheckCircle from '@mui/icons-material/CheckCircle';

const CustomFields = ({ fields }) => {

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Grid item xs={12} md={6}>
            <Card
                elevation={0}
                sx={{
                    borderRadius: 4,
                    p: 3,
                    bgcolor: "background.paper",
                    boxShadow: 0,
                }}
            >
                <Typography variant="h6" fontWeight={600} mb={3}>
                    Featured
                </Typography>

                <Grid container spacing={2}>
                    {fields.map((field, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                            <Card
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 3,
                                    bgcolor: "grey.50",
                                    boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                                    cursor: "default",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    minHeight: { xs: 'auto', md: 250 },
                                }}
                            >
                                {/* Field Title */}
                                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                    {field?.name || `Custom Field ${i + 1}`}
                                </Typography>

                                {/* Field Content */}
                                <Box sx={{ flexGrow: 1 }}>
                                    {field.type === "list" ? (
                                        Array.isArray(field.value) ? (
                                            <Box component="ul" sx={{ pl: 3, mt: 1, mb: 0 }}>
                                                {field.value
                                                    .map((item) => item.trim())
                                                    .filter((item) => item !== "")
                                                    .map((point, idx) => (
                                                        <li key={idx}>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ mb: 0.5 }}
                                                            >
                                                                {point}
                                                            </Typography>
                                                        </li>
                                                    ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" mt={1} color="text.secondary" lineHeight={1.6}>
                                                {field.value || "N/A"}
                                            </Typography>
                                        )
                                    ) : field.type === "mixed" ? (
                                        <Box>
                                            {field.value?.text && (
                                                <Typography variant="body2" color="text.secondary" mb={1}>
                                                    {field.value.text}
                                                </Typography>
                                            )}

                                            {Array.isArray(field.value?.list) ? (
                                                <Box component="ul" sx={{ pl: 3, mt: 1, mb: 0 }}>
                                                    {field.value.list
                                                        .map((item) => item.trim())
                                                        .filter((item) => item !== "")
                                                        .map((point, idx) => (
                                                            <li key={idx}>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    sx={{ mb: 0.5 }}
                                                                >
                                                                    {point}
                                                                </Typography>
                                                            </li>
                                                        ))}
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" mt={1} color="text.secondary" lineHeight={1.6}>
                                                    {field.value?.list || "N/A"}
                                                </Typography>
                                            )}
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" mt={1} color="text.secondary" lineHeight={1.6}>
                                            {field.value || "N/A"}
                                        </Typography>
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Card>
        </Grid>

    )
}

export default CustomFields
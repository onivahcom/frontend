import { Box, Card, Stack, CardContent, Divider, Grid, Paper, Typography, useMediaQuery, Button, } from '@mui/material'
import { CheckCircle } from '@mui/icons-material';
import React, { useState } from 'react'
import theme from '../../Themes/theme';
import { red } from '@mui/material/colors';
import CurrencyRupee from '@mui/icons-material/CurrencyRupee';

const CustomPricing = ({ pricings, onSelect }) => {

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [selectedIndex, setSelectedIndex] = useState(null);


    const handleSelect = (option, index) => {
        const hasPrice = option.price && option.price > 0;
        if (!hasPrice) return;

        const newIndex = selectedIndex === index ? null : index;
        setSelectedIndex(newIndex);

        // Send data to parent
        if (onSelect) {
            if (newIndex === null) {
                onSelect(null); // deselected
            } else {
                onSelect({
                    title: option.title,
                    description: option.description,
                    price: option.price,
                });
            }
        }
    };
    return (
        <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, p: 3, boxShadow: 0 }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                    Offerings
                </Typography>

                <Grid container spacing={2}>
                    {pricings.map((option, index) => {
                        const hasPrice = option.price && option.price > 0;
                        const isSelected = hasPrice && selectedIndex === index;

                        return (
                            <Grid item xs={12} sm={6} key={index}>
                                <Card
                                    onClick={() => handleSelect(option, index)}
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        border: isSelected ? "2px solid #1976d2" : "1px solid #e0e0e0",
                                        bgcolor: isSelected ? "rgba(25,118,210,0.08)" : "grey.50",
                                        cursor: hasPrice ? "pointer" : "default",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        minHeight: { xs: 'auto', md: 250 },
                                        transition: "all 0.3s ease",
                                        "&:hover": hasPrice
                                            ? {
                                                borderColor: "#1976d2",
                                                bgcolor: "rgba(25,118,210,0.04)",
                                                boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                                            }
                                            : {},
                                    }}
                                    elevation={0}
                                >
                                    {/* Package Title and Details */}
                                    <Box mb={2}>
                                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                            {option.title}
                                        </Typography>

                                        <Box component="ul" sx={{ pl: 3, mt: 0, mb: 1 }}>
                                            {option.description.split("\n").map((d, j) => (
                                                <li key={j}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {d}
                                                    </Typography>
                                                </li>
                                            ))}
                                        </Box>
                                    </Box>

                                    {/* Price */}
                                    {hasPrice ? (
                                        <Box textAlign="right">
                                            <Typography
                                                variant="h6"
                                                fontWeight={600}
                                                display="flex"
                                                flexDirection="row"
                                                justifyContent="end"
                                                alignItems="center"
                                                color={isSelected ? "primary.main" : "primary"}
                                            >
                                                <CurrencyRupee color="primary" sx={{ fontSize: 18 }} />
                                                {option.price.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <Typography variant="body2" color="text.disabled" mt={2}>
                                            No price defined
                                        </Typography>
                                    )}
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Card>
        </Grid>

    )
}

export default CustomPricing
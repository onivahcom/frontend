import { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Chip
} from "@mui/material";
import { apiUrl, backendApi } from "../../Api/Api";

function ContentBasedSuggestions({ serviceId }) {
    const [recs, setRecs] = useState([]);

    useEffect(() => {
        backendApi
            .get(`/recommend/${serviceId}`)
            .then((res) => {
                if (res.data.success) {
                    setRecs(res.data.recommendations);
                }
            })
            .catch((err) => console.error("Recommendation fetch failed:", err));
    }, [serviceId]);

    return (
        <Box mt={4} sx={{ p: 2 }}>
            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    fontWeight: 700,
                    mb: 4,
                }}
            >
                You may also like
            </Typography>


            {recs.length === 0 ? (
                <Typography color="text.secondary">No recommendations found.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {recs.map((r) => (
                        <Grid item xs={6} sm={6} md={4} lg={2} key={r.id}>
                            <Card
                                onClick={() => window.open(`/services/${r.id}`, "_blank")}
                                sx={{
                                    cursor: "pointer",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    transition: "0.3s",
                                    borderRadius: 2,
                                    boxShadow: 0,
                                    bgcolor: "transparent",
                                }}
                            >
                                {r.coverImage && (
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={r.coverImage}
                                        alt={r.category}
                                        sx={{
                                            objectFit: "cover",
                                            borderRadius: 4,
                                        }}
                                    />
                                )}

                                <CardContent sx={{
                                    flexGrow: 1,
                                }}>
                                    {/* Business Name */}
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >
                                        {r.businessName || r.category}
                                    </Typography>

                                    {/* Description */}
                                    <Typography
                                        variant="caption"
                                        component="div"
                                        color="text.secondary"
                                        sx={{
                                            mt: 1,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2, // clamp to 2 lines
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "normal",
                                        }}
                                    >
                                        {r.description || "No description available."}
                                    </Typography>


                                    {/* Locations as Chips */}
                                    {r.locations && r.locations.length > 0 && (
                                        <Box
                                            sx={{
                                                mt: 1,
                                                display: "flex",
                                                gap: 1,
                                                overflowX: "auto", // horizontal scroll if many chips
                                                pb: 0.5,           // padding bottom for scroll space
                                                "&::-webkit-scrollbar": {
                                                    display: "none", // Chrome, Safari, Edge
                                                },
                                            }}
                                        >
                                            {r.locations.map((loc, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={loc}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ flexShrink: 0, fontSize: 12, border: "1px solid #ddd", color: "grey" }} // prevent shrinking in scroll
                                                />
                                            ))}
                                        </Box>
                                    )}

                                </CardContent>

                            </Card>
                        </Grid>

                    ))}
                </Grid>
            )
            }
        </Box >
    );
}

export default ContentBasedSuggestions;

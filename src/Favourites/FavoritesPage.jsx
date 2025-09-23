import { Typography, Card, CardContent, CardActions, Grid, IconButton, Button, CardMedia, Container, Box } from "@mui/material";
import { Favorite, FavoriteBorder, NavigateNext } from "@mui/icons-material";
import { useFavorites } from "./FavoritesContext";
import { NavLink, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import FooterComponent from "../components/FooterComponent";

const FavoritesPage = () => {
    const { favorites, toggleFavorite } = useFavorites(); // Get global favorites
    const navigate = useNavigate();

    // Function to format category name for URL
    const formatCategory = (category) => {
        return category
            ?.replace(/_/g, " ") // Replace underscores with spaces
            .split(" ") // Split into words
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Convert to Pascal Case
            .join(""); // Remove spaces for a cleaner URL
    };

    return (
        <div>
            <Header />
            <Container sx={{ mt: 10 }}>

                <Typography variant="h5" align="center" color="primary" fontWeight="bold" gutterBottom>
                    My Favorites
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
                    Here are the services you've marked as favorites. Explore and manage your saved selections easily.
                </Typography>


                <Grid container spacing={4} sx={{ py: 5 }}>
                    {favorites.length === 0 ? (
                        <Box sx={{ minHeight: "50vh", textAlign: "center", width: "100%" }}>
                            <Typography component='h6' align="center" gutterBottom p={2} mt={4} color="grey">No services available currently.</Typography>
                        </Box>
                    ) : (
                        favorites.map((product) => {
                            const formattedCategory = formatCategory(product.category); // Convert category name for URL
                            return (
                                <Grid item xs={6} sm={6} md={4} lg={3} key={product._id} sx={{ mb: 2 }}>
                                    <Card
                                        component={NavLink}
                                        to={`/category/${product.category}/${product._id}`}
                                        sx={{
                                            position: "relative",
                                            borderRadius: 4,
                                            boxShadow: 0,
                                            cursor: "pointer",
                                            textDecoration: "none",
                                            "&:hover": { boxShadow: "0px 6px 5px rgba(0, 0, 0, 0.2)" },
                                        }}
                                    >
                                        {/* Service Image */}
                                        {product.images && (
                                            <CardMedia
                                                component="img"
                                                height={150}
                                                image={product.images.CoverImage[0]}
                                                alt={product.businessName || "Service Image"}
                                                sx={{ objectFit: "cover", borderRadius: 4, }}
                                            />
                                        )}

                                        {/* Service Details */}
                                        <CardContent sx={{ ml: 1, borderRadius: 2, p: 1 }}>
                                            <Typography
                                                variant="body2"
                                                textAlign="left"
                                                sx={{
                                                    color: "#333",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {product.businessName}
                                            </Typography>

                                            <Typography variant="caption" color="textSecondary" textAlign="left">
                                                {formattedCategory}
                                            </Typography>
                                        </CardContent>

                                        {/* Actions */}


                                        <IconButton size="small" sx={{ bgcolor: "#eee", position: "absolute", top: 0, right: 0 }} onClick={() => toggleFavorite(product)}>
                                            {favorites.some(item => item._id === product._id) ? (
                                                <Favorite color="error" sx={{ fontSize: 16 }} />
                                            ) : (
                                                <FavoriteBorder sx={{ fontSize: 16 }} />
                                            )}
                                        </IconButton>
                                    </Card>
                                </Grid>
                            );
                        })
                    )}
                </Grid>

            </Container>
            <FooterComponent />
        </div>
    );
};

export default FavoritesPage;

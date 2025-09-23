import CheckCircle from '@mui/icons-material/CheckCircle';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import React from 'react'

const HostCard = ({ vendorDetails, amenities }) => {

    return (
        <Box maxWidth='sm' sx={{ mt: 3, p: 2, borderRadius: 3, boxShadow: 0, borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd", }}>
            {/* Host Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, }}>
                <Avatar src={vendorDetails?.profilePic} sx={{ width: 64, height: 64 }} />
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            Hosted by {vendorDetails?.firstName || "User"}
                        </Typography>
                        <VerifiedUser sx={{ fontSize: 18 }} />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                        {vendorDetails?.hostingYears || 1} years hosting
                    </Typography>
                </Box>
            </Box>

            {/* Listing amenities */}
            <Box sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    {amenities?.slice(0, 3).map(
                        (highlight, idx) =>
                            highlight && (
                                <Grid item xs={12} key={idx}>
                                    <Box
                                        sx={{
                                            bgcolor: "grey.100",
                                            borderRadius: 2,
                                            p: 1.5,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-start", // align start
                                            gap: 1,
                                            height: "100%",
                                        }}
                                    >
                                        <CheckCircle fontSize="small" sx={{ color: "grey" }} />
                                        <Typography variant="body2" >
                                            {highlight}
                                        </Typography>
                                    </Box>
                                </Grid>
                            )
                    )}
                </Grid>
            </Box>


        </Box>

    );
};

export default HostCard
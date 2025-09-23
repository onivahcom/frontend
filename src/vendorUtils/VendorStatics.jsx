import { Grid, Card, Typography, Box, Divider } from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";
import {
    People,
    Visibility,
    Repeat,
    AccessTime,
} from "@mui/icons-material";

const visitorStats = [
    { title: "Total Visitors", count: 1024, icon: <People /> },
    { title: "Unique Visitors", count: 786, icon: <Visibility /> },
    { title: "Repeat Visitors", count: 238, icon: <Repeat /> },
    { title: "Live Visitors", count: 12, icon: <AccessTime /> },
];

export default function VendorStatics() {
    return (
        <Grid container spacing={4} >
            {/* Chart */}
            <Grid item xs={12} md={8}>
                <Card
                    sx={{
                        p: 3,
                        borderRadius: 4,
                        backgroundColor: "#fff",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                    }}
                >
                    <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                        Visitor Overview
                    </Typography>

                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={visitorStats} barSize={50}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="title"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ fontSize: 14, borderRadius: 10 }}
                                labelStyle={{ fontWeight: 600 }}
                            />
                            <Bar dataKey="count" fill="#7C3AED" radius={[8, 8, 0, 0]}>
                                <LabelList
                                    dataKey="count"
                                    position="top"
                                    style={{ fill: "#4B0082", fontWeight: "bold", fontSize: 13 }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </Grid>

            {/* Summary */}
            <Grid item xs={12} md={4}>
                <Card
                    sx={{
                        p: 3,
                        borderRadius: 4,
                        backgroundColor: "#f5f0ff",
                        boxShadow: 0,
                        // boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                        height: "100%",
                        border: "1px solid #eeee"
                    }}
                >
                    <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                        Summary
                    </Typography>

                    {visitorStats.map((stat, index) => (
                        <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            py={1.5}
                            sx={{ borderBottom: index !== visitorStats.length - 1 ? '1px solid #eee' : 'none' }}
                        >
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "50%",
                                    backgroundColor: "#f5f5f5",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mr: 2,
                                }}
                            >
                                {stat.icon}
                            </Box>
                            <Box>
                                <Typography fontWeight={600} fontSize={15}>
                                    {stat.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {stat.count.toLocaleString()} visitors
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Card>
            </Grid>
        </Grid>
    );
}

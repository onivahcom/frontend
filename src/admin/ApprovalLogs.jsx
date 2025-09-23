import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    TextField,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    InputAdornment,
    IconButton,
    Tooltip,
    Drawer,
    Paper,
    Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import adminAxios from "../Api/Api";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { LocationDisabled, LocationOff, NavigateNext, RemoveRedEye } from "@mui/icons-material";
import { formatCategory } from "../components/RemoveUnderscore";



export default function ApprovalLogs() {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState("");
    const [adminFilter, setAdminFilter] = useState("all");
    const [actionFilter, setActionFilter] = useState("all");

    useEffect(() => {
        adminAxios
            .get("/approval-logs", { withCredentials: true })
            .then((res) => setLogs(res.data))
            .catch((err) => console.error("Error fetching logs:", err));
    }, []);

    // Unique admin list for dropdown
    const admins = [
        ...new Set(logs.map((log) => log.adminId?.userName || "Unknown")),
    ];

    // Filtering logic
    const filteredLogs = logs.filter((log) => {
        const matchesSearch =
            search.trim() === "" ||
            log.approved.some((s) =>
                s.serviceName?.toLowerCase().includes(search.toLowerCase())
            ) ||
            log.declined.some((s) =>
                s.serviceName?.toLowerCase().includes(search.toLowerCase())
            );

        const matchesAdmin =
            adminFilter === "all" ||
            (log.adminId?.userName || "Unknown") === adminFilter;

        const matchesAction =
            actionFilter === "all" ||
            (actionFilter === "approved" && log.approved.length > 0) ||
            (actionFilter === "declined" && log.declined.length > 0);

        return matchesSearch && matchesAdmin && matchesAction;
    });

    const entries = filteredLogs.flatMap((log) => {
        const approvedEntries = log.approved.map((service) => ({
            type: "approved",
            admin: log.adminId?.userName || "Unknown",
            timestamp: log.timestamp,
            service,
        }));

        const declinedEntries = log.declined.map((service) => ({
            type: "declined",
            admin: log.adminId?.userName || "Unknown",
            timestamp: log.timestamp,
            service,
        }));

        return [...approvedEntries, ...declinedEntries];
    });

    const [selectedEntry, setSelectedEntry] = useState(null);

    const handleRowClick = (entry) => {
        setSelectedEntry(entry);
    };

    const handleClose = () => {
        setSelectedEntry(null);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
                Approval & Decline Logs
            </Typography>

            {/* Filters */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
                {/* Search */}
                <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Search by service name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flex: 1, minWidth: "250px" }}
                />

                {/* Admin Filter */}
                <TextField
                    size="small"
                    select
                    label="Filter by Admin"
                    value={adminFilter}
                    onChange={(e) => setAdminFilter(e.target.value)}
                    sx={{ minWidth: "200px" }}
                >
                    <MenuItem value="all">All</MenuItem>
                    {admins.map((admin) => (
                        <MenuItem key={admin} value={admin}>
                            {admin}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Action Filter */}
                <TextField
                    size="small"
                    select
                    label="Filter by Action"
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    sx={{ minWidth: "200px" }}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="declined">Declined</MenuItem>
                </TextField>
            </Box>

            {/* Logs Grid */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 0 }}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Admin</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Service</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entries.map((entry, idx) => (
                            <TableRow
                                key={idx}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleRowClick(entry)}
                            >
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>
                                    {entry.type === "approved" ? (
                                        <Typography
                                            variant="body2"
                                            color="success.main"
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                        >
                                            <VerifiedUser fontSize="small" /> Approved
                                        </Typography>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="error.main"
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                        >
                                            <LocationOff fontSize="small" /> Declined
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>{entry.admin || "Admin"}</TableCell>
                                <TableCell>
                                    {new Date(entry.timestamp).toLocaleString('en-GB', { hour12: true })}
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={entry.service.serviceName} arrow>
                                        <Typography
                                            noWrap
                                            variant="body2"
                                            fontWeight={500}
                                            sx={{ maxWidth: 120 }}
                                        >
                                            {entry.service.serviceName}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Button size="small" variant="text" endIcon={<NavigateNext />}>
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Side Drawer */}
            <Drawer anchor="right" open={!!selectedEntry} onClose={handleClose}>
                {selectedEntry && (
                    <Box sx={{ width: 400, p: 2 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Log Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: 0,
                                border: "1px solid #ddd",
                                height: "100%",
                            }}
                        >
                            <CardContent>
                                {/* Admin + Timestamp */}
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {selectedEntry.admin || "Admin"}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(selectedEntry.timestamp).toLocaleString()}
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                {selectedEntry.type === "approved" ? (
                                    <List dense>
                                        <ListItem
                                            sx={{
                                                p: 1.5,
                                                mb: 1,
                                                borderRadius: 2,
                                                bgcolor: "rgba(76, 175, 80, 0.05)",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            {/* Status */}
                                            <Box display="flex" alignItems="center" mb={2}>
                                                <VerifiedUser color="success" fontSize="small" />
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                    color="success.main"
                                                    sx={{ ml: 0.8, }}
                                                >
                                                    Approved
                                                </Typography>
                                            </Box>

                                            {/* Vendor */}
                                            <Box mb={1} width="100%">
                                                <Typography component='div' variant="caption" color="text.secondary" gutterBottom>
                                                    Vendor Info
                                                </Typography>
                                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                    <Typography variant="body2" >
                                                        {selectedEntry.service.serviceOwner?.firstName || "Vendor"}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {selectedEntry.service.serviceOwner?.email || "N/A"}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Service */}
                                            <Box width="100%">
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatCategory(selectedEntry.service.serviceCategory) ||
                                                        "Service"}
                                                </Typography>
                                                <Tooltip title={selectedEntry.service.serviceName} arrow>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                        sx={{
                                                            overflow: "hidden",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: "vertical",
                                                        }}
                                                    >
                                                        {selectedEntry.service.serviceName}
                                                    </Typography>
                                                </Tooltip>
                                            </Box>
                                        </ListItem>
                                    </List>
                                ) : (
                                    <List dense>
                                        <ListItem
                                            sx={{
                                                p: 1.5,
                                                mb: 1,
                                                borderRadius: 2,
                                                bgcolor: "#f4433608", // light red bg
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            {/* Status */}
                                            <Box display="flex" alignItems="center" mb={2}>
                                                <LocationDisabled color="error" fontSize="small" />
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={600}
                                                    color="error.main"
                                                    sx={{ ml: 0.8 }}
                                                >
                                                    Declined
                                                </Typography>
                                            </Box>

                                            {/* Vendor */}
                                            <Box mb={1} width="100%">
                                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                                    Vendor Info
                                                </Typography>
                                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                                    <Typography variant="body2" >
                                                        {selectedEntry.service.serviceOwner?.firstName || "Vendor"}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {selectedEntry.service.serviceOwner?.email || "N/A"}
                                                    </Typography>
                                                </Box>
                                            </Box>


                                            {/* Service */}
                                            <Box mb={1} width="100%">
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatCategory(selectedEntry.service.serviceCategory) ||
                                                        "Service"}
                                                </Typography>
                                                <Tooltip title={selectedEntry.service.serviceName} arrow>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                        sx={{
                                                            overflow: "hidden",
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: "vertical",
                                                        }}
                                                    >
                                                        {selectedEntry.service.serviceName}
                                                    </Typography>
                                                </Tooltip>
                                            </Box>

                                            {/* Decline reason */}
                                            {selectedEntry.service.declineReason && (
                                                <Box width="100%">
                                                    <Typography variant="caption" color="text.secondary">
                                                        Reason
                                                    </Typography>
                                                    <Tooltip title={selectedEntry.service.declineReason} arrow>
                                                        <Typography
                                                            component="div"
                                                            variant="caption"
                                                            fontStyle="italic"
                                                            sx={{
                                                                fontWeight: 500,
                                                                mt: 0.2,
                                                            }}
                                                        >
                                                            {selectedEntry.service.declineReason}
                                                        </Typography>
                                                    </Tooltip>
                                                </Box>
                                            )}
                                        </ListItem>
                                    </List>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                )}
            </Drawer>


        </Box>
    );
}

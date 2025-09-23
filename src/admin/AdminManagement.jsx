import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    IconButton,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Autocomplete,
    Checkbox,
    Grid,
    Chip,
    Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import adminAxios from "../Api/Api";
import { useNavigate } from "react-router-dom";
import Close from "@mui/icons-material/Close";

const permissionGroups = {
    Dashboard: [{ key: "dashboard", label: "View Dashboard" }],
    Manage: [{ key: "manage_users", label: "Manage Users" }],
    Inbox: [
        { key: "view_inbox", label: "View Inbox" },
        { key: "compose_mail", label: "Compose Mail" }
    ],
    Requests: [
        { key: "view_requests", label: "View Requests" },
        { key: "view_approved_requests", label: "Approved Requests" },
        { key: "view_declined_requests", label: "Declined Requests" },
        { key: "delete_requests", label: "Delete Requests" }
    ],
    Vendors: [
        { key: "view_vendors", label: "View Vendors" },
        { key: "view_vendor_profile", label: "Vendor Profile" }
    ],
    Users: [
        { key: "view_users", label: "View Users" },
        { key: "view_user_profile", label: "User Profile" }
    ],
    Admins: [
        { key: "create_user", label: "Create Admin User" },
        { key: "admin_users", label: "Admin Users" },
        { key: "approval_logs", label: "Approval Logs" },
    ]
};

const roles = ["support", "admin", "superadmin"];


const AdminManagement = () => {

    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    // Fetch all admins
    const fetchAdmins = async () => {
        try {
            const res = await adminAxios.get("/admins", { withCredentials: true });

            console.log(res);
            setAdmins(res.data.admins);
        } catch (err) {
            console.error("Error fetching admins:", err);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // Open Edit Dialog
    const handleEdit = (admin) => {
        setSelectedAdmin({ ...admin, userPassword: "" });
        setOpen(true);
    };

    // Save updated admin
    const handleSave = async () => {
        try {
            await adminAxios.put(`/admins/${selectedAdmin._id}`, selectedAdmin, {
                withCredentials: true,
            });
            setOpen(false);
            fetchAdmins();
        } catch (err) {
            console.error("Error updating admin:", err);
        }
    };

    // Delete admin
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this admin?")) return;
        try {
            await adminAxios.delete(`/admins/${id}`, { withCredentials: true });
            fetchAdmins();
        } catch (err) {
            console.error("Error deleting admin:", err);
        }
    };


    const permissionOptions = Object.entries(permissionGroups).flatMap(([parent, children]) => [
        { key: parent, label: parent, isGroup: true, parent: null, children: children.map((c) => c.key) },
        ...children.map((c) => ({ ...c, parent })),
    ]);


    const permissionMap = Object.values(permissionGroups)
        .flat()
        .reduce((acc, perm) => {
            acc[perm.key] = perm.label;
            return acc;
        }, {});

    return (
        <Box p={3} sx={{ width: "100%" }}>
            <Box display="flex" alignItems="center" mb={4} sx={{ justifyContent: "space-between" }}>
                {/* Left: Title */}
                <Typography variant="h6" fontWeight={500}>
                    Admin Management
                </Typography>

                {/* Right: Add User button */}
                <Button variant="contained" color="primary" onClick={() => (navigate('/admin-dashboard/create-user'))}>
                    Add
                </Button>
            </Box>


            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell>S.No</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Permissions</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {admins.map((admin, index) => (
                        <TableRow sx={{ cursor: 'pointer' }} key={admin.userName} onClick={() => handleEdit(admin)}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{admin.userName}</TableCell>
                            <TableCell>{admin.role}</TableCell>
                            <TableCell>
                                <Box
                                    display="inline-flex"
                                    maxWidth="100%"
                                    overflow="hidden"
                                    whiteSpace="nowrap"
                                    textOverflow="ellipsis"
                                    gap={0.5}
                                >
                                    {admin.permissions?.slice(0, 4).map((key) => (
                                        <Chip
                                            variant="filled"
                                            key={key}
                                            label={permissionMap[key] || key}
                                            size="small"
                                        />
                                    ))}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleEdit(admin)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(admin._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>


            </Table>

            {/* Edit Dialog */}
            <Dialog fullScreen open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogTitle sx={{ bgcolor: "#f2f2f2", mb: 2 }}>
                    <Box display="flex" alignItems="center" sx={{ justifyContent: "space-between" }}>
                        {/* Left: Title */}
                        <Typography variant="h6" fontWeight={500}>
                            Edit User
                        </Typography>

                        {/* Right: Add User button */}
                        <IconButton onClick={() => setOpen(false)}>
                            <Close />
                        </IconButton>
                    </Box>

                </DialogTitle>
                <DialogContent>

                    <Grid container spacing={2} sx={{ maxWidth: 700, mx: 'auto' }}>

                        <Grid item xs={6}>

                            <Typography variant="subtitle2" color='textSecondary' fontWeight={500} gutterBottom>
                                Username
                            </Typography>
                            <TextField
                                fullWidth
                                margin="dense"
                                value={selectedAdmin?.userName || ""}
                                onChange={(e) =>
                                    setSelectedAdmin({ ...selectedAdmin, userName: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid item xs={6}>

                            <Typography variant="subtitle2" color='textSecondary' fontWeight={500} gutterBottom>
                                Password (leave blank if not changing)
                            </Typography>
                            <TextField
                                fullWidth
                                margin="dense"
                                type="text"
                                value={selectedAdmin?.userPassword || ""}
                                onChange={(e) =>
                                    setSelectedAdmin({ ...selectedAdmin, userPassword: e.target.value })
                                }
                            />
                        </Grid>

                        <Grid item xs={6}>

                            <Typography variant="subtitle2" color='textSecondary' fontWeight={500} gutterBottom>
                                Role
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                value={selectedAdmin?.role || ""}
                                onChange={(e) =>
                                    setSelectedAdmin({ ...selectedAdmin, role: e.target.value })
                                }
                                SelectProps={{ native: true }}
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>

                            <Autocomplete
                                multiple
                                options={permissionOptions}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option.label}
                                groupBy={(option) => option.parent || option.label}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.key}>
                                        <Checkbox
                                            size="small"
                                            style={{ marginRight: 8 }}
                                            checked={
                                                option.isGroup
                                                    ? option.children.every((c) => selectedAdmin?.permissions.includes(c))
                                                    : selectedAdmin?.permissions.includes(option.key)
                                            }
                                            indeterminate={
                                                option.isGroup &&
                                                option.children.some((c) => selectedAdmin?.permissions.includes(c)) &&
                                                !option.children.every((c) => selectedAdmin?.permissions.includes(c))
                                            }
                                        />
                                        {option.label}
                                    </li>
                                )}
                                value={permissionOptions.filter(
                                    (opt) =>
                                        (opt.isGroup &&
                                            opt.children.every((c) => selectedAdmin?.permissions.includes(c))) ||
                                        (!opt.isGroup && selectedAdmin?.permissions.includes(opt.key))
                                )}
                                onChange={(e, newValue, reason, details) => {
                                    let updated = [...(selectedAdmin?.permissions || [])];

                                    if (details && details.option) {
                                        const opt = details.option;

                                        if (opt.isGroup) {
                                            const hasAll = opt.children.every((c) => updated.includes(c));
                                            if (hasAll) {
                                                // remove all children
                                                updated = updated.filter((p) => !opt.children.includes(p));
                                            } else {
                                                // add all children
                                                updated = [...new Set([...updated, ...opt.children])];
                                            }
                                        } else {
                                            if (updated.includes(opt.key)) {
                                                updated = updated.filter((p) => p !== opt.key);
                                            } else {
                                                updated = [...updated, opt.key];
                                            }
                                        }
                                    }

                                    setSelectedAdmin((prev) => ({ ...prev, permissions: updated }));
                                }}
                                renderInput={(params) => <TextField {...params} label="Select Permissions" />}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions display="flex" alignItems="center" sx={{ justifyContent: "end", mr: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminManagement;

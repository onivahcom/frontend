import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Divider,
    Grid,
    Checkbox,
    Autocomplete
} from "@mui/material";
import adminAxios from "../Api/Api";

const roles = ["support", "admin", "superadmin"];

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

// Flatten into options for Autocomplete
const buildOptions = (groups) => {
    let options = [];
    Object.entries(groups).forEach(([group, perms]) => {
        // Add parent group as pseudo-option
        options.push({
            key: group,
            label: group,
            isGroup: true,
            children: perms.map((p) => p.key)
        });
        // Add children
        perms.forEach((perm) =>
            options.push({ ...perm, parent: group, isGroup: false })
        );
    });
    return options;
};

const permissionOptions = buildOptions(permissionGroups);

const CreateAdminUser = () => {
    const [form, setForm] = useState({
        userName: "",
        userPassword: "",
        role: "support",
        permissions: []
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.permissions.length < 1) {
            alert('Please select atleast any one of the permissions to continue!')
            return;
        }

        try {
            const res = await adminAxios.post("/create-user", form);
            alert("Admin created successfully!");
        } catch (err) {
            if (err.response) {
                // Server responded with error
                alert(err.response.data.message || "Error creating user");
            } else {
                // Network or other error
                alert("Something went wrong, please try again");
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 0 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight={500}>
                        Create Admin User
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: 'auto' }}>
                        <Grid container spacing={2}>
                            {/* Username */}
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color='textSecondary' fontWeight={500} gutterBottom>
                                    Username
                                </Typography>
                                <TextField
                                    required
                                    fullWidth
                                    name="userName"
                                    value={form.userName}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, userName: e.target.value }))
                                    }
                                />
                            </Grid>

                            {/* Password */}
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color='textSecondary' fontWeight={500} gutterBottom>
                                    Password
                                </Typography>
                                <TextField
                                    required
                                    fullWidth
                                    type="text"
                                    name="userPassword"
                                    value={form.userPassword}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, userPassword: e.target.value }))
                                    }
                                />
                            </Grid>

                            {/* Role */}
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color='textSecondary' fontWeight={500} gutterBottom>
                                    Role
                                </Typography>
                                <TextField
                                    select
                                    required
                                    fullWidth
                                    value={form.role}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, role: e.target.value }))
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

                            {/* Permissions */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color='textSecondary' fontWeight={500} gutterBottom>
                                    Permissions
                                </Typography>
                                <Autocomplete
                                    required
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
                                                        ? option.children.every((c) => form.permissions.includes(c))
                                                        : form.permissions.includes(option.key)
                                                }
                                                indeterminate={
                                                    option.isGroup &&
                                                    option.children.some((c) => form.permissions.includes(c)) &&
                                                    !option.children.every((c) => form.permissions.includes(c))
                                                }
                                            />
                                            {option.label}
                                        </li>
                                    )}
                                    value={permissionOptions.filter(
                                        (opt) =>
                                            (opt.isGroup &&
                                                opt.children.every((c) => form.permissions.includes(c))) ||
                                            (!opt.isGroup && form.permissions.includes(opt.key))
                                    )}
                                    onChange={(e, newValue, reason, details) => {
                                        let updated = [...form.permissions];

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

                                        setForm((prev) => ({ ...prev, permissions: updated }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Select Permissions" />
                                    )}
                                />

                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 3, textAlign: "right" }}>
                            <Button type="submit" variant="contained" color="primary">
                                Create User
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CreateAdminUser;

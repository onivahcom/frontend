import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Grid, Card, CardMedia, IconButton,
    TextField, CardActions, Divider, Tooltip, Stack, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { apiUrl, backendApi } from '../Api/Api';
import axios from 'axios';
import ReusableSnackbar from '../utils/ReusableSnackbar';
import Folder from '@mui/icons-material/Folder';



const ImageManager = ({ initialImagesFromDB = {}, vendor = {}, category, categoryId, serviceId }) => {

    const [folders, setFolders] = useState([]);
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderImages, setNewFolderImages] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });


    useEffect(() => {
        const init = Object.entries(initialImagesFromDB).map(([folderName, urls]) => ({
            id: Date.now() + Math.random(),
            folderName,
            editableName: folderName,
            isEditing: false,
            images: urls.map(url => ({ url, isNew: false }))
        }));
        setFolders(init);
    }, [initialImagesFromDB]);

    console.log(folders);

    const handleImageUpload = (folderId, files) => {
        const fileArray = Array.from(files);
        Promise.all(fileArray.map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({ file, url: reader.result, isNew: true });
                };
                reader.readAsDataURL(file);
            });
        })).then(newImages => {
            setFolders(prev => prev.map(folder => {
                if (folder.id === folderId) {
                    if (folder.folderName === 'CoverImage') {
                        return { ...folder, images: [newImages[0]] };
                    } else {
                        return { ...folder, images: [...folder.images, ...newImages] };
                    }
                }
                return folder;
            }));
        });
    };

    const handleRemoveImage = (folderId, index) => {
        setFolders(prev =>
            prev.map(folder => {
                if (folder.id === folderId) {
                    const updated = [...folder.images];
                    updated.splice(index, 1);
                    return { ...folder, images: updated };
                }
                return folder;
            })
        );
    };

    const handleFolderNameEdit = async (folderId, editing = true) => {
        // Find the current folder
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return;

        // If saving (editing = false), check for name change
        if (!editing && folder.folderName !== folder.editableName) {
            try {
                const response = await fetch(`${apiUrl}/vendor/update-folder-name`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        serviceId,
                        category,
                        categoryId,
                        oldName: folder.folderName,
                        newName: folder.editableName,
                    }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Failed to update folder name');
                }

                // Update the folderName (not just editableName) in state
                setFolders(prev =>
                    prev.map(f =>
                        f.id === folderId
                            ? {
                                ...f,
                                isEditing: editing,
                                folderName: folder.editableName, // Apply new name to folderName
                            }
                            : f
                    )
                );

                setSnackbar({
                    open: true,
                    message: 'Folder name updated successfully.',
                    severity: 'success',
                });
            } catch (error) {
                console.error('Error updating folder name:', error.message);
                setSnackbar({
                    open: true,
                    message: 'Failed to update folder name.',
                    severity: 'error',
                });
            }
        } else {
            // If name didn't change or just starting editing, just update editing state
            setFolders(prev =>
                prev.map(f =>
                    f.id === folderId ? { ...f, isEditing: editing } : f
                )
            );
        }
    };


    const handleFolderNameChange = (folderId, newName) => {
        setFolders(prev =>
            prev.map(folder =>
                folder.id === folderId ? { ...folder, editableName: newName } : folder
            )
        );
    };

    const handleFinalSave = async () => {
        const formData = new FormData();
        const folderMap = [];

        folders.forEach((folder) => {
            folder.images.forEach((imgObj) => {
                if (imgObj.isNew && imgObj.file) {
                    formData.append("images", imgObj.file);
                    folderMap.push({
                        fileName: imgObj.file.name,
                        folderName: folder.editableName,
                    });
                } else {
                    folderMap.push({
                        fileUrl: imgObj.url,
                        folderName: folder.editableName,
                    });
                }
            });
        });

        formData.append("folderMap", JSON.stringify(folderMap));
        formData.append("vendorId", vendor?.vendorId || "");
        formData.append("category", category || "");
        formData.append("categoryId", categoryId || "");


        try {
            const uploadResponse = await fetch(`${apiUrl}/api/s3/upload-images`, {
                method: "POST",
                body: formData,
            });

            const uploadResult = await uploadResponse.json();

            if (!uploadResponse.ok) {
                console.log(uploadResult.error);
            }

            // Step: Update folders with new image URLs
            const updatedFolders = folders.map(folder => {
                const folderName = folder.editableName;

                // 1. Existing images (fileUrl already exists)
                const existingImages = folder.images
                    .filter(img => !img.isNew)
                    .map(img => ({
                        url: img.url,
                        isNew: false
                    }));

                // 2. Newly uploaded images from groupedUrls
                const newlyUploaded = (uploadResult.groupedUrls[folderName] || []).map(uploaded => ({
                    url: uploaded.url,
                    isNew: false // now it's no longer new
                }));

                // 3. Merge both into the new folder object
                return {
                    ...folder,
                    images: [...existingImages, ...newlyUploaded]
                };
            });

            // Optional: setFolders(updatedFolders) if using state
            const folderLog = {};

            updatedFolders.forEach(folder => {
                folderLog[folder.editableName] = folder.images.map(img => img.url);
            });

            const updatePayload = {
                category: category || "",
                categoryId: categoryId || "",
                images: folderLog, // ✅ Entire structure (old + new)
            };


            const updateResponse = await backendApi.post(
                `/vendor/update-images`,
                updatePayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            // Axios puts the parsed JSON directly in `response.data`
            const updateResult = updateResponse.data;

            setSnackbar({
                open: true,
                message: 'Images uploaded successfully',
                severity: 'success',
            });

        } catch (error) {
            // alert("An unexpected error occurred during image save.");
        }
    };


    const handleNewFolderImageSelect = (files) => {
        const fileArray = Array.from(files);
        Promise.all(fileArray.map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({ file, url: reader.result, isNew: true });
                };
                reader.readAsDataURL(file);
            });
        })).then(setNewFolderImages);
    };

    const createNewFolder = () => {
        if (!newFolderName.trim() || newFolderImages.length === 0) {

            setSnackbar({
                open: true,
                message: 'Please enter a folder name and upload at least one image',
                severity: 'warning',
            });
            return;
        }

        const newFolder = {
            id: Date.now() + Math.random(),
            folderName: newFolderName,
            editableName: newFolderName,
            isEditing: false,
            images: newFolderImages
        };

        setFolders(prev => [...prev, newFolder]);
        setNewFolderName('');
        setNewFolderImages([]);
    };

    const handleDeleteFolder = async (folder) => {
        if (window.confirm("Are you sure you want to delete this folder and all its images?")) {
            setFolders(prev => prev.filter(item => item.id !== folder.id));

            try {
                const response = await backendApi.post(
                    `/vendor/delete-folder`,
                    {
                        category,
                        categoryId,
                        folderName: folder.folderName
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true, // 👈 Required if your backend uses cookies/auth
                    }
                );

                const result = response.data;

                setSnackbar({
                    open: true,
                    message: 'Folder deleted successfully.',
                    severity: 'success',
                });

            } catch (error) {

                setSnackbar({
                    open: true,
                    message: 'Error deleting folder',
                    severity: 'warning',
                });
            }
        }
    };



    return (
        <Box p={3} >
            <Divider sx={{ mb: 1 }} />

            {/* ➕ Add New Folder Section */}
            <Box mb={5}>
                <Typography variant="body5" fontWeight={500} component='div' gutterBottom mb={1}>Add New Folder</Typography>
                <Typography variant="caption" color="text.secondary" component='div' mb={2}>
                    <strong>Step 1:</strong> Enter folder name &nbsp;&nbsp;
                    <strong>Step 2:</strong> Upload atleast one image &nbsp;&nbsp;
                    <strong>Step 3:</strong> Click <em>"Create Folder"</em>
                </Typography>


                <Grid container spacing={2} alignItems="center" mb={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Folder Name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            size="small"
                            sx={{ maxWidth: 400 }}

                        />
                    </Grid>

                    <Grid item xs={6} sm='auto'>
                        <Button
                            size="small"
                            component="label"
                            variant="outlined"
                            startIcon={<AddPhotoAlternateIcon />}
                            sx={{ maxWidth: 400 }}
                        >
                            Upload Images
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                multiple
                                onChange={(e) => handleNewFolderImageSelect(e.target.files)}
                            />
                        </Button>
                    </Grid>

                    <Grid item xs={6} sm='auto'>
                        <Button
                            size="small"
                            variant="contained"
                            onClick={createNewFolder}
                            sx={{ maxWidth: 400 }}
                        >
                            Create Folder
                        </Button>
                    </Grid>
                </Grid>


                {newFolderImages.length > 0 && (
                    <Grid container spacing={2}>
                        {newFolderImages.map((img, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="160"
                                        image={img.url}
                                        alt={`Preview ${index + 1}`}
                                    />
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
                {/* <Divider sx={{ my: 1 }} /> */}
            </Box>

            {/* <Box mt={4} textAlign="end">
                <Button sx={{ mb: 2, ml: 2, maxWidth: 300, placeSelf: "end", textTransform: "none" }}
                    variant="contained" color="primary" size='small' onClick={handleFinalSave}>
                    Save
                </Button>
            </Box> */}

            {/* 🗂 Existing Folders */}
            {folders.map(folder => (
                <Box key={folder.id} mb={5}>
                    <Box mb={2} p={2} borderRadius={2} sx={{ bgcolor: '#f8f8f8', maxWidth: 500 }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            flexWrap="wrap"
                        >
                            {/* Folder Display or Edit Mode */}
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                {folder.folderName === 'CoverImage' ? (
                                    <Chip
                                        icon={<Folder sx={{ color: "white" }} />}
                                        label={folder.folderName}
                                        sx={{
                                            bgcolor: "#ffffff",
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            px: 1.5,
                                            boxShadow: 0,
                                            '.MuiChip-icon': {
                                                color: 'grey',
                                            }
                                        }}
                                    />
                                ) : folder.isEditing ? (
                                    <>
                                        <Folder sx={{ color: "orange" }} />
                                        <TextField
                                            autoFocus
                                            value={folder.editableName}
                                            onChange={(e) => handleFolderNameChange(folder.id, e.target.value)}
                                            size="small"
                                            variant="outlined"
                                            sx={{ minWidth: 180 }}
                                        />
                                    </>
                                ) : (
                                    <Chip
                                        icon={<Folder sx={{ color: "orange" }} />}
                                        label={folder.editableName}
                                        sx={{
                                            bgcolor: "#ffffff",
                                            fontSize: '1rem',
                                            fontWeight: 500,
                                            px: 1.5,
                                            boxShadow: 0,
                                            '.MuiChip-icon': {
                                                color: 'grey',
                                            }
                                        }}
                                    />
                                )}
                            </Stack>

                            {/* Action Buttons (Right Side) */}
                            <Stack direction="row" spacing={1} alignItems="center">
                                {folder.isEditing && (
                                    <Tooltip title="Save Folder Name" arrow>
                                        <IconButton
                                            onClick={() => handleFolderNameEdit(folder.id, false)}
                                            color="success"
                                            size="small"
                                        >
                                            <SaveIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}

                                {folder.folderName !== 'CoverImage' && !folder.isEditing && (
                                    <Tooltip title="Edit Folder Name" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleFolderNameEdit(folder.id, true)}
                                            color="primary"
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}

                                {folder.folderName !== 'CoverImage' && (
                                    <Tooltip title="Delete Folder" arrow>
                                        <IconButton
                                            onClick={() => handleDeleteFolder(folder)}
                                            sx={{
                                                bgcolor: 'grey.100',
                                                '&:hover': { bgcolor: 'grey.200' },
                                                p: 1,
                                                borderRadius: 1,
                                            }}
                                        >
                                            <DeleteIcon color="grey" fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Stack>
                        </Stack>
                    </Box>

                    <Box display="flex" justifyContent="end" mb={2}>
                        <Button
                            component="label"
                            startIcon={<AddPhotoAlternateIcon />}
                            sx={{ mb: 1, maxWidth: 300, placeSelf: "end", textTransform: "none" }}
                        >
                            {folder.folderName === 'CoverImage' ? 'Replace Image' : 'Upload Images'}
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                multiple={folder.folderName !== 'CoverImage'}
                                onChange={(e) => handleImageUpload(folder.id, e.target.files)}
                            />
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        {folder.images.map((img, index) => (
                            <Grid item xs={6} sm={6} md={4} lg={2} key={index}>
                                <Card
                                    sx={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        borderRadius: 2,
                                        boxShadow: 1,
                                        transition: 'box-shadow 0.3s ease',
                                        '&:hover': {
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        // height="200"
                                        image={img.url}
                                        alt={`Image ${index + 1}`}
                                        sx={{
                                            // aspectRatio: 16 / 9,
                                            height: { xs: 150, md: 200 },
                                            objectFit: 'cover',
                                        }}
                                    />

                                    {/* Floating Delete Button */}
                                    {folder.folderName !== 'CoverImage' && (
                                        <IconButton
                                            onClick={() => handleRemoveImage(folder.id, index)}
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                backgroundColor: 'rgba(255,255,255,0.8)',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,1)',
                                                },
                                            }}
                                            size="small"
                                        >
                                            <DeleteIcon fontSize="small" color="grey" />
                                        </IconButton>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                </Box>
            ))}

            <ReusableSnackbar
                open={snackbar.open}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                message={snackbar.message}
                severity={snackbar.severity}
            />

            <Box mt={4} textAlign="center">
                <Button variant="contained" color="primary" onClick={handleFinalSave}>
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
};

export default ImageManager;

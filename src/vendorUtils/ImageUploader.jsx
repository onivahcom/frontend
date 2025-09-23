import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    IconButton,
    Breadcrumbs,
    Paper,
    Chip,
    Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const ImageUploader = ({ onFormDataReady, sendFoldersToParent, imageFolders, setImageFolders }) => {


    const { vendor } = useOutletContext()

    const [newFolderName, setNewFolderName] = useState("");

    useEffect(() => {
        sendFoldersToParent(imageFolders); // 🔥 Send to parent here
    }, [imageFolders]); // runs once on mount

    const handleCreateFolder = () => {
        const trimmedName = newFolderName.trim();
        if (!trimmedName) {
            alert('Please give the folder name!');
            return;
        }

        const exists = imageFolders.some(
            folder => folder.folderName.toLowerCase() === trimmedName.toLowerCase()
        );

        if (exists) {
            alert('Folder name already exists. Please choose a different name.');
            return;
        }

        const newFolder = {
            id: Date.now(),
            folderName: trimmedName,
            images: [],
        };

        setImageFolders([...imageFolders, newFolder]);
        setNewFolderName('');
    };


    const handleImageUpload = (folderId, files) => {
        const fileArray = Array.from(files);

        Promise.all(
            fileArray.map((file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({
                            file,
                            previewUrl: URL.createObjectURL(file),
                            base64Preview: reader.result, // ✅ add base64 for persistent preview
                        });
                    };
                    reader.readAsDataURL(file); // Convert to base64
                });
            })
        ).then((imageFiles) => {
            const updatedFolders = imageFolders.map((folder) => {
                if (folder.id === folderId) {
                    if (folder.folderName === 'CoverImage') {
                        return { ...folder, images: [imageFiles[0]] }; // One image only
                    }
                    return { ...folder, images: [...folder.images, ...imageFiles] };
                }
                return folder;
            });

            localStorage.setItem("uploadedImageFolders", JSON.stringify(updatedFolders));
            setImageFolders(updatedFolders);


            // --- Immediately generate FormData & send to parent ---
            const formData = new FormData();
            const folderMap = [];

            updatedFolders.forEach((folder) => {
                folder.images.forEach((imgObj) => {
                    formData.append("images", imgObj.file);
                    folderMap.push({
                        fileName: imgObj.file.name,
                        folderName: folder.folderName,
                    });
                });
            });

            formData.append("folderMap", JSON.stringify(folderMap));
            formData.append("vendorId", vendor?.vendorId);

            if (typeof onFormDataReady === "function") {
                onFormDataReady(formData);
            }
        });
    };


    const handleRemoveImage = (folderId, imageIndex) => {
        setImageFolders((prev) =>
            prev.map((folder) =>
                folder.id === folderId
                    ? {
                        ...folder,
                        images: folder.images.filter((_, idx) => idx !== imageIndex),
                    }
                    : folder
            )
        );
    };

    const handleDeleteFolder = (folderId) => {
        setImageFolders((prev) =>
            prev.filter((folder) => {
                if (folder.folderName === "Cover Image") return true; // don't delete default folder
                return folder.id !== folderId;
            })
        );
    };



    useEffect(() => {
        return () => {
            imageFolders.forEach((folder) =>
                folder.images.forEach((img) => URL.revokeObjectURL(img.previewUrl))
            );
        };
    }, [imageFolders]);





    const isValid = imageFolders[0].images.length < 1;

    return (
        <Box >



            {/* Create Folder */}
            <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: "#f8f8f8", width: "100%", }}>
                <Stack direction={{ xs: "column", sm: "row", }} justifyContent='space-between' alignItems='center' spacing={2}>


                    <Box>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Showcase
                        </Typography>
                        <Typography variant="body5" color="textSecondary" gutterBottom>
                            create and add your stunning images
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <TextField
                            label="New Folder Name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            size="small"
                            sx={{ bgcolor: "white", mr: 1 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateFolder}
                        >
                            Create
                        </Button>
                    </Box>
                </Stack>


                {/* Folder Cards */}
                {imageFolders.map((folder) => {

                    return (

                        <Box key={folder.id} mt={4} sx={{ bgcolor: "white", p: 2, borderRadius: 2 }}>

                            <Box
                                key={folder.id}
                                mt={4}
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                    📁 {folder.folderName.replace(/([A-Z])/g, ' $1').trim()}
                                </Typography>

                                <Button
                                    startIcon={<DeleteIcon />}
                                    sx={{ color: "grey", }}
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleDeleteFolder(folder.id)}
                                    aria-label="Delete folder"
                                    disabled={folder.folderName === "CoverImage"}
                                >
                                    Delete
                                </Button>
                            </Box>


                            {
                                folder.folderName === "CoverImage" &&
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    align="left"
                                    color="textSecondary"
                                    sx={{
                                        borderLeft: 4,
                                        borderColor: "purple",
                                        bgcolor: "#fcfaff",
                                        px: 2,
                                        py: 1,
                                        fontSize: "0.8rem",
                                        borderRadius: 1,
                                        fontStyle: "italic",
                                        userSelect: "none",
                                        width: "fit-content"
                                    }}
                                >
                                    Note: Add a cover image to complete your profile
                                </Typography>
                            }

                            {/* Upload Input */}
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<UploadFileIcon />}
                                sx={{
                                    mb: 2,
                                    mt: 2,
                                    textTransform: "none",
                                }}
                            >
                                {folder.folderName === 'CoverImage' ? 'Cover Image' : 'Choose Files'}

                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    multiple={folder.folderName !== 'CoverImage'}
                                    onChange={(e) => handleImageUpload(folder.id, e.target.files)}
                                />
                            </Button>

                            {
                                folder.folderName === "CoverImage" && isValid &&
                                <Typography
                                    variant="span"
                                    gutterBottom
                                    align="left"
                                    color="error"
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        fontSize: "0.8rem",
                                        borderRadius: 1,
                                        fontStyle: "italic",
                                        width: "fit-content"
                                    }}
                                >
                                    Required *
                                </Typography>
                            }

                            {/* Image Grid */}
                            <Box
                                sx={{
                                    columnCount: 3,
                                    columnGap: "16px",
                                    width: "100%",
                                }}
                            >
                                {folder.images.map((img, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            breakInside: "avoid",
                                            position: "relative",
                                            mb: 2,
                                            border: "1px solid #ddd",
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            transition: "0.3s",
                                            "&:hover": {
                                                boxShadow: 3,
                                            },
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={img.base64Preview}
                                            alt={`img-${index}`}
                                            sx={{
                                                width: "100%",
                                                height: "auto",
                                                display: "block",
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            color="error"
                                            sx={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                bgcolor: "white",
                                                boxShadow: 1,
                                                "&:hover": { bgcolor: "#ffe5e5" },
                                            }}
                                            onClick={() => handleRemoveImage(folder.id, index)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>



                        </Box>
                    )
                }
                )}

            </Paper>
        </Box>
    );
};

export default ImageUploader;

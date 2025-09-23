import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { Grid, Typography, Box, Button } from '@mui/material';
import CategoryForm from '../vendorUtils/CategoryForm'; // Make sure the path is correct
import withLoadingAndError from '../hoc/withLoadingAndError';
import axios from 'axios';
import { apiUrl, backendApi } from '../Api/Api';

// Mock function to simulate an API call based on servicename (profileForm)
const getServiceData = async (profileForm) => {

    const data = {
        // party hall
        party_hall: {
            image: 'https://img.freepik.com/premium-photo/photographer-capturing-moments-wedding-ceremony_1158260-58631.jpg?w=1060',
            bio: 'Capture beautiful moments with our professional photography services.',
            // fields: [
            //     {
            //         name: 'hallType',
            //         label: 'Hall Type',
            //         type: 'checkbox',
            //         options: [
            //             { label: 'Pre-Wedding', value: 'Pre-Wedding' },
            //             { label: 'Wedding Photography', value: 'Wedding Photography' },
            //             { label: 'Album & Print', value: 'Album & Print' },
            //         ]
            //     },
            //     // {
            //     //     name: 'seatingCapacity',
            //     //     label: 'Seating Capacity',
            //     //     type: 'number'
            //     // },
            //     // {
            //     //     name: 'restrictions',
            //     //     label: 'Restrictions',
            //     //     type: 'textarea'
            //     // },
            //     // {
            //     //     name: 'facilities',
            //     //     label: 'Facilities',
            //     //     type: 'textarea'
            //     // },
            //     {
            //         name: 'priceRange',
            //         label: 'Price Range/ hr',
            //         type: 'number'
            //     }
            // ]
        },
        // banquet hall
        mandabam: {
            image: 'https://img.freepik.com/premium-photo/elegant-banquet-hall-with-luxurious-decorations_123827-123.jpg?w=1060',
            bio: 'Spacious and luxurious banquet halls for all your special events.',
            // fields: getVenueFields()
        },

        // conference hall
        convention_center: {
            image: 'https://img.freepik.com/premium-photo/modern-conference-room-with-large-table-chairs_123827-456.jpg?w=1060',
            bio: 'Modern and well-equipped conference halls for business meetings and events.',
            // fields: getVenueFields()
        },
        // conference hall
        farm_land: {
            image: 'https://img.freepik.com/premium-photo/modern-conference-room-with-large-table-chairs_123827-456.jpg?w=1060',
            bio: 'Modern and well-equipped conference halls for business meetings and events.',
            // fields: getVenueFields()
        },
        // event venue
        beach_wedding: {
            image: 'https://img.freepik.com/premium-photo/event-venue-decorated-fairy-lights-elegant-table-settings_123827-789.jpg?w=1060',
            bio: 'Versatile event venues for weddings, parties, and corporate gatherings.',
            // fields: [{
            //     name: 'priceRange',
            //     label: 'Price Range/day',
            //     type: 'number'
            // }]
        },
        // photography
        photography: {
            image: 'https://img.freepik.com/premium-photo/photographer-capturing-moments-wedding-ceremony_1158260-58631.jpg?w=1060',
            bio: 'Capture beautiful moments with our professional photography services.',
            // fields: [
            //     {
            //         name: 'servicesOffered',
            //         label: 'Services Offered',
            //         type: 'checkbox',
            //         options: [
            //             { label: 'Pre-Wedding', value: 'Pre-Wedding' },
            //             { label: 'Wedding Photography', value: 'Wedding Photography' },
            //             { label: 'Album & Print', value: 'Album & Print' },
            //             { label: 'Maternity Photoshoot', value: 'Maternity Photoshoot' },
            //             { label: 'Candid', value: 'Candid' },
            //             { label: 'Indoor & Outdoor', value: 'Indoor & Outdoor' },
            //         ]
            //     },
            //     {
            //         name: 'priceRange',
            //         label: 'Price Range/ hr',
            //         type: 'number'
            //     }
            // ]
        },
        // catering
        catering: {
            image: 'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            bio: 'Good food to live good life.',
            // fields: [
            //     {
            //         name: 'servicesOffered',
            //         label: 'Services Offered',
            //         type: 'checkbox',
            //         options: [
            //             { label: 'Full Services Catering', value: 'Full Services Catering' },
            //             { label: 'Wedding Catering', value: 'Wedding Catering' },
            //             { label: 'Buffet Catering', value: 'Buffet Catering' },
            //             { label: 'Corporate Event Catering', value: 'Corporate Event Catering' },
            //             { label: 'Social Event Catering', value: 'Social Event Catering' },
            //             { label: 'Cocktail Party Catering', value: 'Cocktail Party Catering' }
            //         ]
            //     },
            //     {
            //         name: 'foodType',
            //         label: 'Food Type',
            //         type: 'checkbox',
            //         options: [
            //             { label: 'Veg', value: 'Veg' },
            //             { label: 'Non-veg', value: 'Non-veg' },
            //             { label: 'Vegan', value: 'Vegan' },
            //             { label: 'Brahmin', value: 'Brahmin' },
            //             { label: 'Jain', value: 'Jain' },
            //         ]
            //     },
            //     {
            //         name: 'minOrders',
            //         label: 'Minimum Orders',
            //         type: 'number'
            //     },
            //     {
            //         name: 'maxOrders',
            //         label: 'Maximum Orders',
            //         type: 'number'
            //     }
            // ]
        },
        // decors
        decors: {
            image: 'https://images.pexels.com/photos/169196/pexels-photo-169196.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            bio: 'Capture beautiful moments with our colorful decorations.',
            // fields: [
            //     {
            //         name: 'servicesOffered',
            //         label: 'Services Offered',
            //         type: 'checkbox',
            //         options: [
            //             { label: 'Stage Decorations', value: 'Stage Decorations' },
            //             { label: 'Royal Decorations', value: 'Royal Decorations' },
            //             { label: 'Floral Decorations', value: 'Floral Decorations' },
            //         ]
            //     },
            //     {
            //         name: 'priceRange',
            //         label: 'Price Range/ hr',
            //         type: 'number'
            //     }
            // ]
        },
        // event- planner
        event_planners: {
            image: 'https://images.pexels.com/photos/169196/pexels-photo-169196.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            bio: 'We plan to make your day a memorable.',
            // fields: [
            //     {
            //         name: 'servicesOffered',
            //         label: 'Services Offered',
            //         type: 'checkbox',
            //         options: [
            //             { label: 'Themed Wedding', value: 'Themed Wedding' },
            //             { label: 'Destination Wedding', value: 'Destination Wedding' },
            //             { label: 'Beach Wedding', value: 'Beach Wedding' },
            //         ]
            //     },
            //     {
            //         name: 'priceRange',
            //         label: 'Price Range/day',
            //         type: 'number'
            //     }
            // ]
        },

    };

    return data[profileForm] || {
        image: 'path/to/default-image.jpg',
        bio: 'Service not found. Please select a valid service.',
        fields: []
    };
};

const VendorformLayout = ({ setLoading, setError, loading, error }) => {
    const { profileForm } = useParams();  // Get the dynamic parameter from the URL
    const [fields, setFields] = useState([]);
    const [serviceInfo, setServiceInfo] = useState(null);

    useEffect(() => {
        // Fetch service data based on profileForm (e.g., photography)
        const fetchServiceData = async () => {
            const service = await getServiceData(profileForm);
            setServiceInfo(service);
            setFields(service.fields);
        };

        fetchServiceData();
    }, [profileForm]);

    const handleFormSubmit = async (formData) => {

        try {
            const submissionData = new FormData();

            // Append all non-file fields
            Object.entries(formData).forEach(([key, value]) => {

                if (key === 'file' || key === 'images' || key === 'groupedUrls') return; // handled separately

                if (key === 'customFields' && Array.isArray(value)) {
                    // Directly append the customFields array
                    submissionData.append('customFields', JSON.stringify(value));
                    return;
                }

                if (key === 'generatedWhyUs' && Array.isArray(value)) {
                    // Directly append the customFields array
                    submissionData.append('generatedWhyUs', JSON.stringify(value));
                    return;
                }

                if (key === 'customPricing' && Array.isArray(value)) {
                    // Directly append the customFields array
                    submissionData.append('customPricing', JSON.stringify(value));
                    return;
                }
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        submissionData.append(`${key}[${index}]`, item);
                    });
                } else {
                    submissionData.append(key, value);
                }
            });



            // Append Aadhar file
            if (formData.file) {
                submissionData.append('file', formData.file); // single file field
            }

            // Append groupedUrls as JSON string
            if (formData.groupedUrls) {
                submissionData.append('groupedUrls', JSON.stringify(formData.groupedUrls));
            }


            // Add category transformation (optional)
            const category = profileForm?.toLowerCase().replace(/ /g, "_");
            submissionData.append('category', category);



            // Send POST request with multipart / form - data
            const response = await backendApi.post(`/venue-submission`, submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Form submitted successfully!');
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data?.details) {
                // It's spam
                const spamFields = error.response.data.details;
                let message = 'Spam detected in the following fields:\n';
                spamFields.forEach(f => {
                    message += `${f.field}`;
                });
                alert(message);
            } else {
                console.error('Error submitting form:', error);
                alert('There was an error submitting the form. Please try again.');
            }
        }
    };


    return (
        <Box maxWidth='lg' mx='auto'>
            {/* <VendorHeader /> */}
            <Box padding={1} >

                {serviceInfo && (
                    <Box mb={3} position="relative">
                        {/* Service Image */}
                        <Box
                            component="img"
                            src={serviceInfo.image}
                            alt={`${profileForm} service`}
                            sx={{
                                width: "100%",
                                maxHeight: { xs: 150, md: 200 },
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />


                        {/* Overlay Text */}
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                textTransform: "capitalize",
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                            }}
                        >
                            {profileForm
                                ?.split('_')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ')}
                        </Typography>
                    </Box>
                )}


                {
                    loading ? <Typography>Loading...</Typography>
                        :
                        // Render dynamic form 
                        < CategoryForm fields={fields} onSubmit={handleFormSubmit} />
                }
            </Box>
        </Box>
    );
};

export default withLoadingAndError(VendorformLayout);

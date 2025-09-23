// import { Button } from '@mui/material'
// import React from 'react'
// import GoogleIcon from '@mui/icons-material/Google';
// import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
// import { googleAuth } from '../../api';

// const GoogleLogin = () => {


//     const responseGoogle = async (authResult) => {
//         try {
//             if (authResult['code']) {
//                 const result = await googleAuth(authResult['code'])
//                 const { email, name, picture } = result.data
//                 console.log(result.data);
//             }
//         } catch (error) {
//             console.log("Error :", error);
//         }
//     }

//     const handleLogin = useGoogleLogin({
//         onSuccess: responseGoogle,
//         onError: responseGoogle,
//         flow: () => 'auth-code',
//     })
//     return (
//         <GoogleOAuthProvider clientId='339859707035-jf6e5j9dvgsk8dmg5lcddbp2mukkr1jd.apps.googleusercontent.com'>
//             <Button
//                 variant="contained"
//                 fullWidth
//                 startIcon={<GoogleIcon />}
//                 sx={{ backgroundColor: '#db4437', color: 'white' }}
//                 onClick={() => handleLogin()}
//             >
//                 Continue with Google
//             </Button>
//         </GoogleOAuthProvider>
//     )
// }

// export default GoogleLogin


import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from '../../api';

const GoogleLogin = () => {
    const [user, setUser] = useState(null); // State to store user info

    const responseGoogle = async (authResult) => {
        try {
            if (authResult && authResult.code) {
                const result = await googleAuth(authResult.code);
                const { email, name, picture } = result.data;
                console.log("User Info:", result.data);

                // Store user info in state
                setUser({ email, name, picture });
            } else {
                console.log("No authorization code received.");
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

    const handleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: () => 'auth-code',
    });

    // Adding the event listener for popup closure
    useEffect(() => {
        const handlePopupClosure = (event) => {
            // console.log("Message received:", event.data); // Log received messages
            if (event.origin !== window.location.origin) return;

            if (event.data === 'popup closed') {
                console.log('Popup has been closed');
            }
        };

        // Attach the event listener
        window.addEventListener('message', handlePopupClosure);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('message', handlePopupClosure);
        };
    }, []); // Empty dependency array ensures this runs once

    return (
        <GoogleOAuthProvider clientId='339859707035-jf6e5j9dvgsk8dmg5lcddbp2mukkr1jd.apps.googleusercontent.com'>
            <Button
                variant="contained"
                fullWidth
                startIcon={<GoogleIcon />}
                sx={{
                    backgroundColor: '#007bff',      // Solid blue background
                    color: 'white',
                    borderRadius: 2,            // Rounded edges for a modern look
                    padding: '12px 0',               // More padding for a larger feel
                    fontSize: '1rem',              // Larger text for prominence
                    // fontWeight: 'bold',
                    // boxShadow: '0px 8px 16px rgba(0, 123, 255, 0.3)', // Soft shadow for depth
                    transition: 'all 0.3s ease',     // Smooth transition for hover effects
                    '&:hover': {
                        backgroundColor: '#0056b3',  // Slightly darker blue on hover
                        boxShadow: '0px 10px 20px rgba(0, 86, 179, 0.4)', // Enhanced shadow on hover
                        transform: 'translateY(-2px)', // Slight lift effect
                    },
                    '&:active': {
                        transform: 'translateY(1px)',  // Button presses down slightly on click
                        boxShadow: '0px 6px 12px rgba(0, 86, 179, 0.3)', // Subtle shadow on click
                    },
                }}
                onClick={() => handleLogin()}
            >
                Continue with Google
            </Button>
        </GoogleOAuthProvider>
    );
};

export default GoogleLogin;



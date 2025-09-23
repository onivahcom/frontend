import { createContext, useContext, useState, useEffect } from "react";

// Create the Context
const FavoritesContext = createContext();

// Provider Component
export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Load favorites from localStorage when the app starts
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(savedFavorites);
    }, []);

    // Function to Add/Remove Favorite
    const toggleFavorite = (service) => {
        setFavorites(prevFavorites => {
            let updatedFavorites;
            const exists = prevFavorites.some(item => item._id === service._id);

            if (exists) {
                updatedFavorites = prevFavorites.filter(item => item._id !== service._id);
            } else {
                // Store only necessary fields
                const minimizedService = {
                    _id: service._id,
                    category: service.category,
                    businessName: service.additionalFields.businessName || "Unknown",
                    images: service.images || null, // Store only the first image (Base64)
                };
                updatedFavorites = [...prevFavorites, minimizedService];
            }

            localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Persist to localStorage
            return updatedFavorites;
        });
    };


    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

// Custom Hook for easy access
export const useFavorites = () => useContext(FavoritesContext);

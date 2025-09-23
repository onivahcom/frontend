import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminAxios from '../Api/Api';
import NotAuthorized from '../admin/Utils/NotAuthorized';

const AdminProtected = ({ children, requiredPermission }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminData, setAdminData] = useState(null);

    const fetchAdminData = async () => {
        try {
            const res = await adminAxios.get("/admin-protected", {
                withCredentials: true, // ✅ important for cookies
            });
            return res.data;
        } catch (err) {
            console.log("Access denied or session expired", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchAdminData()
            .then((data) => {
                setAdminData(data.data.admin); // ✅ store backend response
                setIsAuthenticated(true);
            })
            .catch(() => {
                navigate("/admin-login");
            });
    }, [navigate]);

    if (!isAuthenticated) return null;

    // ✅ Permission check (if required)
    if (requiredPermission && !adminData?.permissions?.includes(requiredPermission)) {
        return <NotAuthorized />;
    }

    // ✅ Pass adminData into children
    return React.cloneElement(children, { adminData });
};

export default AdminProtected;

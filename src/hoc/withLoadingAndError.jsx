import React, { useState } from 'react';

const withLoadingAndError = (WrappedComponent) => {
    return (props) => {
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);

        const handleError = (error) => {
            setError(error)
            setLoading(false)
        }
        const handleLoading = (value) => {
            setError(null)
            setLoading(value)
        }

        return (
            <WrappedComponent
                loading={loading}
                setLoading={handleLoading}
                error={error}
                setError={handleError}
                {...props}
            />
        );
    };
};

export default withLoadingAndError;

import React, { useState } from "react";
import { Pagination, TableBody, Box, TableRow, TableCell } from "@mui/material";

const PaginationWrapper = ({
    data,
    defaultRowsPerPage = 5,
    renderRow
}) => {
    const [page, setPage] = useState(1); // MUI Pagination is 1-based
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Slice the data for the current page
    const paginatedData = data.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const totalPages = Math.ceil(data.length / rowsPerPage);

    return (
        <>
            {/* Render only current page's data */}
            <TableBody>
                {paginatedData.map((row, index) =>
                    renderRow(row, index + (page - 1) * rowsPerPage)
                )}
            </TableBody>

            {/* Pagination controls */}
            <TableCell colSpan={8} sx={{ width: "100%", }}>
                <Pagination
                    sx={{ placeSelf: "center" }}
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    shape="rounded"
                />
            </TableCell >
        </>
    );
};

export default PaginationWrapper;

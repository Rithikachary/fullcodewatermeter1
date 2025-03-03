import React from "react";
import { Pagination, Select, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomPaginationContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px", // Space between pagination and row selector
  padding: "10px",
  background: "transparent",
  borderRadius: "50px",
  margin: "20px 0",
  alignContent :"end",
  justifyContent  :"flex-end",

});

const StyledPagination = styled(Pagination)({
  "& .MuiPaginationItem-root": {
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    color: "#7b235b",
    backgroundColor: "transparent",
    border: "1px solid black",
    margin: "0 5px",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    "&.Mui-selected": {
      backgroundColor: "#7b235b",
      borderColor: "white",
      color: "white",
      fontWeight: "bold",
    },
  },
  "& .MuiPaginationItem-previousNext": {
    backgroundColor: "#7b235b",
    border: "4px solid white",
    color: "white",
    "&:hover": {
      backgroundColor: "#7b235b",
      border: "2px solid white",
    },
  },
});

const CustomPagination = ({ count, page, onChange, rowsPerPage, onRowsPerPageChange }) => {
  const handlePageChange = (_, value) => {
    if (value > 0 && value <= count) {
      onChange(value - 1); // Ensure zero-based index for React state
    }
  };

  return (
    <CustomPaginationContainer>
      <Select
        value={rowsPerPage}
        onChange={(e) => {
          onRowsPerPageChange(parseInt(e.target.value, 10));
        }}
        sx={{
          color: "white",
          border: "2px solid white",
          borderRadius: "10px",
          backgroundColor: "#7b235b",
          "& .MuiSvgIcon-root": { color: "white" },
        }}
      >
        <MenuItem value={5}>5 Rows</MenuItem>
        <MenuItem value={10}>10 Rows</MenuItem>
        <MenuItem value={25}>25 Rows</MenuItem>
      </Select>
      <StyledPagination
        count={count}
        page={page + 1} // Convert back to 1-based for Material UI
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
    </CustomPaginationContainer>
  );
};

export default CustomPagination;



// code to add for every render of the custom pagination components
// const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);


//   const handleChangePage = (newPage) => {
//     if (newPage >= 0 && newPage < Math.ceil(meters.length / rowsPerPage)) {
//       setPage(newPage);
//     }
//   };


//   const handleChangeRowsPerPage = (newRows) => {
//     setRowsPerPage(newRows);
//     setPage(0);
//   };
  
//   <CustomPagination
//     count={Math.ceil(meters.length / rowsPerPage)}
//     page={page + 1}  // Convert zero-based index to one-based
//     onChange={(newPage) => setPage(newPage - 1)} // Convert back to zero-based
//     rowsPerPage={rowsPerPage}
//     onRowsPerPageChange={handleChangeRowsPerPage}
//   />;







//   {meters
//     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//     .map((meter) => (

//     ))}




//     {/* ✅ Custom Pagination Component with Props */}
//             <CustomPagination
//               count={Math.ceil(meters.length / rowsPerPage)}
//               page={page}
//               onChange={handleChangePage}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
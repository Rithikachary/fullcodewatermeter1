import React, { useState, useEffect, use } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert , Divider } from "@mui/material";
import "./AllMeters.css";
import CustomPagination from "../Components/CustomPagination";
import { useNavigate } from "react-router-dom";
//import HierarchySelection from "../Components/HierarchySelection";

const AllMeters = () => {
  const [formData , setFormData] = useState({});
  const [meters, setMeters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
   const navigate = useNavigate();

  // Fetch Auth Token
  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return null;
    }
    return token;
  };

  useEffect(() => {
    const fetchMeters = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await fetch("/api/data/meter/getAll", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch meters");
        }
        const data = await response.json();
        setMeters(data || []); // Ensure data is always an array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeters();
  }, []);



  
  const handleChangePage = (newPage) => {
    if (newPage >= 0 && newPage < Math.ceil(meters.length / rowsPerPage)) {
      setPage(newPage);
    }
  };


  const handleChangeRowsPerPage = (newRows) => {
    setRowsPerPage(newRows);
    setPage(0);
  };
  
  <CustomPagination
    count={Math.ceil(meters.length / rowsPerPage)}
    page={page + 1}  // Convert zero-based index to one-based
    onChange={(newPage) => setPage(newPage - 1)} // Convert back to zero-based
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
  />


  return (
    <div className="all-meter">
        <div className="meter">
        
        <h4 className="h4">All Meters</h4>
        <p className="delete-text">Here you can see all the meters.</p>
        <Divider />
        {/* <HierarchySelection formData={formData} setFormData={setFormData} /> */}
        <div className="meters-data">

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && meters.length === 0 && <p>No meters found.</p>}

      {!loading && !error && meters.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead >
              <TableRow style={{ backgroundColor: "#f0f0f0"}}>
                <TableCell style={{color: "white"}}><strong>Serial No</strong></TableCell>
                <TableCell style={{color: "white"}}><strong>Manufacturer</strong></TableCell>
                <TableCell style={{color: "white"}}><strong>Year</strong></TableCell>
                {/* <TableCell><strong>Address</strong></TableCell> */}
                <TableCell style={{color: "white"}}><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {meters
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((meter) => (
                <TableRow key={meter.id} 
                style={{
                                              cursor: "pointer",
                                              
                                              
                                            }}
                                            onClick={() => {
                                              if (meter.meterSrNo) {
                                                navigate(`/meter-details/${meter.consumerId}/${meter.meterSrNo}`);
                                              } else {
                                                console.error("meterSrNo is missing in meter data:", meter);
                                              }
                                            }}>
                  <TableCell>{meter.meterSrNo || "N/A"}</TableCell>
                  <TableCell>{meter.manufacturerName || "N/A"}</TableCell>
                  <TableCell>{meter.yearOfManufacture || "N/A"}</TableCell>
                  {/* <TableCell>{meter.address || "Not available"}</TableCell> */}
                  <TableCell>{meter.status || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
           {/* ✅ Custom Pagination Component with Props */}
            <CustomPagination
               count={Math.ceil(meters.length / rowsPerPage)}
               page={page}
               onChange={handleChangePage}
               rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
    </div>
    </div>
    </div>
  );
};

export default AllMeters;



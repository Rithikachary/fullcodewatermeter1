import React, { useState } from "react";
import "./MeterMap.css";
import { FormControl } from "@mui/material";

export default function Add() {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError(true);
      setErrorMessage("You are not authenticated. Please log in.");
      return null;
    }
    return token;
  };

  const [formData, setFormData] = useState({
    meterSrNo: "",
    yearOfManufacture: "",
    initialAccumulatedFlow: "",
    manufacturerName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch("http://14.195.14.194:8081/data/meter/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Data submitted successfully");
      } else {
        alert("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred");
    }
  };

  return (
    <div className="meter-mapping">
      <div className="meter">

        <div className="hierarchy-section">
        <h2>Add Meter</h2>
        <FormControl component="form" onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="meterSrNo">Meter Serial No.</label>
            <input type="text" id="meterSrNo" value={formData.meterSrNo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="yearOfManufacture">Year of Manufacture</label>
            <input type="text" id="yearOfManufacture" value={formData.yearOfManufacture} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="initialAccumulatedFlow">Initial Accumulated Flow</label>
            <input type="text" id="initialAccumulatedFlow" placeholder="in m³" value={formData.initialAccumulatedFlow} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="manufacturerName">Manufacturer Name</label>
            <input type="text" id="manufacturerName" value={formData.manufacturerName} onChange={handleChange} />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </FormControl>
      </div>
      </div>
    </div>
  );
}

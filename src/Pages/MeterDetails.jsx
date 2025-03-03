import React, { useState, useEffect, use } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import GoBack from "../Components/GoBack";

import { FaTint, FaArrowDown, FaArrowUp, FaThermometerHalf } from "react-icons/fa";
import {
  faTint, // For Meter Model
  faMicrochip, // For Meter ID
  faCog, // For Firmware
  faBatteryThreeQuarters, // For Battery
  faSignal, // For Signal
  faUser, // For Customer Name
  faMapMarkerAlt, // For Address
} from "@fortawesome/free-solid-svg-icons";

import "./MeterDetails.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { useParams } from "react-router-dom";


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const MeterDetails = () => {
  const { meterId } = useParams();  // ✅ Get meterSrNo from URL
  const {consumerId} = useParams();

console.log("Extracted meterSrNo:", consumerId);


  const [selectedDate, setSelectedDate] = useState(new Date()) 
  const [readings, setReadings] = useState({
    accumulatedFlow: 0,
    reverseFlow: 0,
    temperature: 0,
    instantFlow: 0,
    meterSrNo : "",
  });

  
  const [graphData, setGraphData] = useState({ labels: [], datasets: [] });



  const [hierarchyDetails, setHierarchyDetails] = useState({
    state: "",
    zone: "",
    circle: "",
    area: "",
    consumer: "",
  });
  
  

  // Fetch Auth Token
  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Authentication Error: No token found.");
      return null;
    }
    return token;
  };

  const fetchReadings = async () => {
    const token = getAuthToken();
    if (!token) return;
  
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const apiUrl = `http://14.195.14.194:8081/data/get/meterSrNo=${meterId}/date=${formattedDate}`;
  
    console.log("API Request URL:", apiUrl);
  
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("API Response:", response);
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
        // Get the meterSrNo from the response and set it in state
        if (data && data.length > 0) {
          setReadings((prev) => ({ ...prev, meterSrNo: data[0].meterId }));  // Assuming the meterSrNo is part of the response
        }
  
      
      console.log("Fetched Data:", data);
  
      if (Array.isArray(data) && data.length > 0) {
        const latestReading = data.sort(
          (a, b) => new Date(b.dataTimestamp) - new Date(a.dataTimestamp)
        )[0];
        setReadings(latestReading);
      } else {
        setReadings({ accumulatedFlow: 0, reverseFlow: 0, temperature: 0, instantFlow: 0 });
      }
    } catch (error) {
      console.error("Error fetching readings:", error);
    }
  };
  

  // Fetch latest data on component mount & when date changes
  useEffect(() => {
    fetchReadings();
  }, [selectedDate]);

  const fetchGraphData = async () => {
    const token = getAuthToken();
    if (!token) return;
    
    // const meterSrNo = "90000002"; // Your meter serial number
    const apiUrl = `http://14.195.14.194:8081/data/getAll/meterSrNo=${meterId}`;
  
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
  
      const data = await response.json();
  
      // Ensure data is an array and not empty
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("No data available or invalid format received");
      }
  
      // Get today's date and the date 30 days ago
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
  
      // Filter data to include only entries from the last 30 days
      const filteredData = data.filter(entry => {
        const entryDate = new Date(entry.dataTimestamp);
        return entryDate >= thirtyDaysAgo && entryDate <= today;
      });
  
      // Group the data by date and take the last entry for each day
      const groupedByDate = filteredData.reduce((acc, entry) => {
        const entryDate = new Date(entry.dataTimestamp).toISOString().split("T")[0];
        if (!acc[entryDate]) {
          acc[entryDate] = entry;
        } else {
          // Replace with the latest data entry for that day (based on timestamp)
          const currentTimestamp = new Date(acc[entryDate].dataTimestamp);
          const newTimestamp = new Date(entry.dataTimestamp);
          if (newTimestamp > currentTimestamp) {
            acc[entryDate] = entry;
          }
        }
        return acc;
      }, {});
  
      // Extract the last entry for each day and prepare data for the graph
      const lastEntries = Object.values(groupedByDate);
  
      // Prepare the labels and datasets
      const labels = lastEntries.map(entry =>
        new Date(entry.dataTimestamp).toISOString().split("T")[0]  // Date in YYYY-MM-DD format
      );
  
      const accumulatedFlowData = lastEntries.map(entry => entry.accumulatedFlow);
      const reverseFlowData = lastEntries.map(entry => entry.reverseFlow);
      const temperatureData = lastEntries.map(entry => entry.temperature);
      const instantFlowData = lastEntries.map(entry => entry.instantFlow);
  
      setGraphData({
        labels,
        datasets: [
          {
            label: "Accumulated Flow",
            data: accumulatedFlowData,
            borderColor: "blue",
            fill: false,
          },
          {
            label: "Reverse Flow",
            data: reverseFlowData,
            borderColor: "red",
            fill: false,
          },
          {
            label: "Temperature",
            data: temperatureData,
            borderColor: "orange",
            fill: false,
          },
          {
            label: "Instant Flow",
            data: instantFlowData,
            borderColor: "yellow",
            fill: false,
          }
        ],
      });
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };
  
  useEffect(() => {
    if (meterId) {
      fetchGraphData();
    }
  }, [meterId]);



  const fetchHierarchyDetails = async () => {
    if (!consumerId) return;
  
    const token = getAuthToken();
    if (!token) return;
  
    const apiUrl = `http://14.195.14.194:8081/hierarchy/data/dataId=${consumerId}`;
  
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Fetched Hierarchy Data:", data);
  
      if (data) {
        setHierarchyDetails({
          state: data.name || "N/A",
          zone: data.children?.[0]?.name || "N/A",
          circle: data.children?.[0]?.children?.[0]?.name || "N/A",
          area: data.children?.[0]?.children?.[0]?.children?.[0]?.name || "N/A",
          consumer: data.children?.[0]?.children?.[0]?.children?.[0]?.children?.[0]?.name || "N/A",
        });
      }
    } catch (error) {
      console.error("Error fetching hierarchy details:", error);
    }
  };

  
  useEffect(() => {
    if (consumerId) {
      fetchHierarchyDetails();
    }
  }, [consumerId]);


  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigates to the previous page
  };
  
  




  
  
  
  return (
    <div className="meter-detail">
  

<GoBack customStyle={{ marginLeft: "260px", marginTop: "100px" }} />





    <div className="meter-container" style={{marginTop : "-10px"}}>
      
    
      {/* Meter Details Section */}
      <div className="meter-details">
        <h1>Device Details</h1>

        <div className="status-table">
          <div className="status-row">
            <div className="label">
              <FontAwesomeIcon icon={faTint} className="icon" />
              <span>Model</span>
            </div>
            <strong>Ultrasonic GPRS</strong>
          </div>
        </div>

        <div className="status-table">
          <div className="status-row">
            <div className="label">
              <FontAwesomeIcon icon={faMicrochip} className="icon" />
              <span>Meter ID</span>
            </div>
            <strong>{meterId}</strong>
          </div>
        </div>

        {/* Firmware, Battery, and Signal */}
        <div className="status-table">
          <div className="status-row">
            <div className="label">
              <FontAwesomeIcon icon={faCog} className="icon" />
              <span>Firmware v1.1.1</span>
            </div>
            <span className="status"><b>Up to date</b></span>
          </div>
          <div className="status-row">
            <div className="label">
              <FontAwesomeIcon icon={faBatteryThreeQuarters} className="icon" />
              <span>Battery 85%</span>
            </div>
            <span className="status good"><b>Good</b></span>
          </div>
          <div className="status-row">
            <div className="label">
              <FontAwesomeIcon icon={faSignal} className="icon" />
              <span>Signal Strength</span>
            </div>
            <span className="status connected"><b>Excellent</b></span>
          </div>
        </div>
      </div>

      {/* Customer Information Section */}
<div className="customer-info">
  <h1>Customer Details</h1>


  <div className="info-row">
    <div className="label">
      <FontAwesomeIcon icon={faUser} className="icon" />
      <span>Name</span>
    </div>
    <strong>{hierarchyDetails.consumer || "NA"}</strong>
  </div>

  <div className="info-row">
    <div className="label">
    
      <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
      <span>Address</span>
    </div>
    <span>{hierarchyDetails.circle || "NA"}, {hierarchyDetails.area || "NA"}, {hierarchyDetails.zone || "NA"}, {hierarchyDetails.state || "NA"}</span>
    
  </div>

  <div className="info-row"><span>Zone</span> <span>{hierarchyDetails.zone || "NA"}</span></div>
  <div className="info-row"><span>Area</span> <span>{hierarchyDetails.area || "NA"}</span></div>
  <div className="info-row"><span>City</span> <span>{hierarchyDetails.circle || "NA"}</span></div>
  <div className="info-row"><span>State/Country</span> <span>{hierarchyDetails.state || "NA"}, India</span></div>
</div>



      {/* Reading Details */}
      <div className="readings-container">
        <div className="header">
          <h3> Meter Readings 
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="date-picker"
            dateFormat="yyyy ,MMMM d"
           
          />
          </h3>
        </div>

        <div className="readings-grid">
          <div className="reading-box">
            <div className="reading-label">
              <FaTint className="icon blue" />
              <span>Accumulated Flow</span>
            </div>
            <strong>{readings.accumulatedFlow} m³</strong>
          </div>

          <div className="reading-box">
            <div className="reading-label">
              <FaArrowDown className="icon red" />
              <span>Reverse Flow</span>
            </div>
            <strong>{readings.reverseFlow} m³</strong>
          </div>

          <div className="reading-box">
            <div className="reading-label">
              <FaThermometerHalf className="icon orange" />
              <span>Temperature</span>
            </div>
            <strong>{readings.temperature} °C</strong>
          </div>

          <div className="reading-box">
            <div className="reading-label">
              <FaArrowUp className="icon green" />
              <span>Instant Flow</span>
            </div>
            <strong>{readings.instantFlow} m³/h</strong>
          </div>
        </div>
      </div> 

    </div>
    <div className="graph-container">
          <Line data={graphData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
    </div>
    
  );

  
};


export default MeterDetails;
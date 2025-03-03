import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormControl, Select, MenuItem, TextField, Button, Divider, CircularProgress } from "@mui/material";
import "./Configure.css";


const Configure = () => {
  const [configure, setConfigure] = useState([]);
  const [topic, setTopic] = useState('');
  const [payload, setPayload] = useState('');
  const [qos, setQos] = useState(0);  
  const [retainRequired, setRetainRequired] = useState(true);  
  const [status, setStatus] = useState('active');  
  const [authToken, setAuthToken] = useState(null); 
  const [loading, setLoading] = useState(false); 

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Authentication required. Please log in.");
      return null;
    }
    return token;
  };

  useEffect(() => {
    const token = getAuthToken();
    setAuthToken(token);
  }, []);

  useEffect(() => {
    const fetchConfigure = async () => {
      const token = getAuthToken();
      if (!token) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `http://14.195.14.194:8081/c2dmessages/publish?topic=${topic}&payload=${payload}&qos=${qos}&retain=${retainRequired}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setConfigure(response.data);
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        setLoading(false);
      }
    };

    if (topic && payload) {
      fetchConfigure();
    }
  }, [topic, payload, qos, retainRequired]);

  const handleSave = async () => {
    try {
      // Define the required parameters for the API request
      // const topic = '/device/conf/12345678';
      // const payload = 'selectCommand=changeRTC';
      // const qos = 1;
      // const retainRequired = 'true';
  
      // Retrieve the token from localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authorization token not found');
      }
  
      // Send the request with the correct method (e.g., GET instead of POST)
      const response = await axios({
        method: 'GET',  // Change to GET if the server expects it
        url: `http://14.195.14.194:8081/c2dmessages/publish?topic=${encodeURIComponent(topic)}&payload=${encodeURIComponent(payload)}&qos=${qos}&retainRequired=${retainRequired}`,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      console.log('Message sent successfully:', response.data);
    } catch (error) {
      // Handle errors
      if (error.response) {
        console.error('Error sending message:', error.response.status, error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  };
  
  
  

  const handleCancel = () => {
    setTopic('');
    setPayload('');
    setQos(0);
    setRetainRequired(true);  
    setStatus('active');  
  };

  return (
    <div className="configure-container">
      <div className="configure">
        <h4 className="h4">Configure</h4>
        <p className="delete-text">Here you can configure any changes to the end device.</p>
        <Divider />
        <div className="main">
          {/* Topic Selection */}
          <div className="form-row">
            <label className="form-label">Select Topic Name:</label>
            <FormControl style={{ flex: 1 }}>
              <Select value={topic} onChange={(e) => setTopic(e.target.value)} fullWidth>
                <MenuItem value="Device/Config">Device/Config</MenuItem>
                <MenuItem value="Device/Config/MeterSno">Device/Config/MeterSno</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Payload Message */}
          <div className="form-row">
            <label className="form-label">Payload Message:</label>
            <FormControl style={{ flex: 1 }}>
              <TextField
                variant="outlined"
                placeholder="Enter payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                fullWidth
              />
            </FormControl>
          </div>

          {/* QoS Dropdown */}
          <div className="form-row">
            <label className="form-label">Quality of Service:</label>
            <FormControl style={{ flex: 1 }}>
              <Select value={qos} onChange={(e) => setQos(e.target.value)} fullWidth>
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Retain Required Checkbox */}
          <div className="form-row">
            <label className="form-label">Retain Required:</label>
            <FormControl style={{ flex: 1 }}>
              <Select
                value={retainRequired ? 'true' : 'false'}  
                onChange={(e) => setRetainRequired(e.target.value === 'true')}  
                fullWidth
              >
                <MenuItem value="true">True</MenuItem>
                <MenuItem value="false">False</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Save and Cancel Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '30px', marginTop: '20px', marginLeft: "240px", marginBottom: "20px" }}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#7b235b', color: 'white' }}
              onClick={handleSave}
              disabled={loading}  // Disable save button when loading
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: 'gray', color: 'black' }}
              onClick={handleCancel}
              disabled={loading}  // Disable cancel button when loading
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configure;

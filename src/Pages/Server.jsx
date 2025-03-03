import React from "react";
import { Avatar, Divider,FormControl,InputLabel,Select,MenuItem , Grid , TextField,Button } from '@mui/material';
import { useState } from "react";
import { useEffect } from "react";
import "./Server.css";
import { useNavigate } from 'react-router-dom';




const Server = ( ) =>{
  const [showTable, setShowTable] = useState(false);
  const [showText, setShowText] = useState(false);
     const navigate = useNavigate();

    const handleNextClick = () => {
    navigate('/configure/mqtt');
    };
 
  const dummyRecords = [
    {
      srno: 1,
      metersrno: "10000001",
      Serverurl:"14.195.14.194",
      ServerPort:"1883",
      status: "Active",
      timestamp: "24-12-2024 10:00:00",
    },
    {
      srno: 2,
      metersrno: "10000008",
      Serverurl:"14.195.14.194",
      ServerPort:"1883",
      status: "Inactive",
      timestamp: "20-12-2024 11:00:00",
    },
    {
      srno: 3,
      metersrno: "10000006",
      Serverurl:"14.195.14.194",
      ServerPort:"1883",
      status: "Active",
      timestamp: "24-12-2024 12:00:00",
    },
    {
      srno: 4,
      metersrno: "10000009",
      Serverurl:"14.195.14.194",
      ServerPort:"1883",
      status: "Inactive",
      timestamp: "21-12-2024 13:00:00",
    },
    {
      srno: 5,
      metersrno: "10000005",
      Serverurl:"14.195.14.194",
      status: "Active",
      ServerPort:"1883",
      timestamp: "24-12-2024 14:00:00",
    },
    {
      srno: 6,
      metersrno: "10000002",
      Serverurl:"14.195.14.194",
      ServerPort:"1883",
      status: "Inactive",
      timestamp: "23-12-2024 15:00:00",
    },
    {
      srno: 7,
      metersrno: "10000003",
      Serverurl: "14.195.14.194",
      ServerPort:"1883",
      status: "Active",
      timestamp: "24-12-2024 16:00:00",
    },
    {
      srno: 8,
      metersrno: "10000012",
      Serverurl:"14.195.14.194",
      ServerPort:"1883",
      status: "Inactive",
      timestamp: "22-12-2024 17:00:00",
    },
    {
      srno: 9,
      metersrno: "10000042",
      Serverurl: "14.195.14.194",
      ServerPort:"1883",
      status: "Active",
      timestamp: "24-12-2024 18:00:00",
    },
    {
      srno: 10,
      metersrno: "10000052",
      Serverurl: "14.195.14.194",
      ServerPort:"1883",
      status: "Inactive",
      timestamp: "23-12-2024 19:00:00",
    },
  ];
    const meterData = [{region: "Hyderabad",
      circle: "Central",
      zone: "Zone 1",
      subStation: "Sub Station A",
      division: 3,}];

   const [selectedOption, setSelectedOption] = useState("");
   const handleSelection = (event) => {
    setSelectedOption(event.target.value);


  };
 


    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState("all");
    const [selectedCircle, setSelectedCircle] = useState("all");
    const [selectedZone, setSelectedZone] = useState("all");
    const [selectedSubStation, setSelectedSubStation] = useState("all");
    const [selectedDivision, setSelectedDivision] = useState("all");
    const [selectedIds, setSelectedIds] = useState([]);
    const [data] = useState(dummyRecords);
 
   
  
    // Helper functions for filters
    const getAvailableRegions = () => [...new Set(meterData.map((m) => m.region))];
    const getAvailableCircles = () =>
      [...new Set(meterData.filter((m) => selectedRegion === "all" || m.region === selectedRegion).map((m) => m.circle))];
    const getAvailableZone = () =>
      [...new Set(meterData.filter((m) =>
        (selectedRegion === "all" || m.region === selectedRegion) &&
        (selectedCircle === "all" || m.circle === selectedCircle)
      ).map((m) => m.zone))];
    const getAvailableSubStations = () =>
      [...new Set(meterData.filter((m) =>
        (selectedRegion === "all" || m.region === selectedRegion) &&
        (selectedCircle === "all" || m.circle === selectedCircle) &&
        (selectedZone === "all" || m.zone === selectedZone)
      ).map((m) => m.subStation))];
    const getAvailableDivisions = () =>
      [...new Set(meterData.filter((m) =>
        (selectedRegion === "all" || m.region === selectedRegion) &&
        (selectedCircle === "all" || m.circle === selectedCircle) &&
        (selectedZone === "all" || m.zone === selectedZone)
      ).map((m) => m.division))];
  // Search functionality
  const handleSearch = (e) => setSearchTerm(e.target.value);
     // Selection functionality
     const toggleSelect = (id) => {
      setSelectedIds((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((i) => i !== id)
          : [...prevSelected, id]
      );
    };
  
    const toggleSelectAll = () => {
      setSelectedIds(selectedIds.length === filteredData.length ? [] : filteredData.map((item) => item.id));
    };
    const filteredData = dummyRecords.filter((record) =>
      (record.customerName && record.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.metersrno.toString().includes(searchTerm) ||
      (record.area && record.area.toLowerCase().includes(searchTerm.toLowerCase()))
    );



    return (

<div className="server-config">
<div className="server">
<h4 className="h4">Server</h4>
<Divider />
<div
      style={{
        display: "flex",
        flexDirection: "row",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        width: "90%",
        height:"120px",
        margin: "20px auto",
      }}
    >
      <label style={{ marginRight: "20px" }}>
        <input
          type="radio"
          name="selection"
          value="area"
          checked={selectedOption === "area"}
          onChange={handleSelection}
        />
        Area Selection
      </label>
      <label>
        <input
          type="radio"
          name="selection"
          value="meterSrNo"
          checked={selectedOption === "meterSrNo"}
          onChange={handleSelection}
        />
        Meter SR No
      </label>

    {selectedOption === 'area' &&
    
    <div className="areawise-container">
          {/* Region Select */}
          <FormControl variant="outlined" className="custom-form-control1">
            <InputLabel>Filter by Region</InputLabel>
            <Select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}
              label = "Filter By Region">
              <MenuItem value="all">All</MenuItem>
              {getAvailableRegions().map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
                </Select>
                </FormControl>

  {/* Circle Select */}
  <FormControl className="custom-form-control1" variant="outlined" disabled={selectedRegion === 'all'}>
    <InputLabel>Filter by Circle</InputLabel>
    <Select
      value={selectedCircle}
      onChange={(e) => setSelectedCircle(e.target.value)}
      label="Filter by Circle"
    >
      <MenuItem value="all">All Circles</MenuItem>
      {getAvailableCircles().map((circle, index) => (
        <MenuItem key={index} value={circle}>
          {circle}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  {/* Division Select */}
  <FormControl className="custom-form-control1" variant="outlined" disabled={selectedCircle === 'all'}>
    <InputLabel>Filter by Division</InputLabel>
    <Select
      value={selectedDivision}
      onChange={(e) => setSelectedDivision(e.target.value)}
      label="Filter by Division"
    >
      <MenuItem value="all">All Divisions</MenuItem>
      {getAvailableDivisions().map((division, index) => (
        <MenuItem key={index} value={division}>
          {division}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  {/* Zone Select */}
  <FormControl className="custom-form-control1" variant="outlined" disabled={selectedDivision === 'all'}>
    <InputLabel>Filter by Zone</InputLabel>
    <Select
      value={selectedZone}
      onChange={(e) => setSelectedZone(e.target.value)}
      label="Filter by Zone"
    >
      <MenuItem value="all">All Zones</MenuItem>
      {getAvailableZone().map((zone, index) => (
        <MenuItem key={index} value={zone}>
          {zone}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  {/* Substation Select */}
  <FormControl className="custom-form-control1" variant="outlined" disabled={selectedZone === 'all'}>
    <InputLabel>Filter by Substation</InputLabel>
    <Select
      value={selectedSubStation}
      onChange={(e) => setSelectedSubStation(e.target.value)}
      label="Filter by Substation"
    >
      <MenuItem value="all">All Substations</MenuItem>
      {getAvailableSubStations().map((substation, index) => (
        <MenuItem key={index} value={substation}>
          {substation}
        </MenuItem>
      ))}
    </Select>
    <Button 
            variant="contained"
            style={{ backgroundColor: "#7b235b",  width : '100px', marginTop: "-78px",marginLeft:"180px"}}
            onClick={() => {
               setShowTable(true);
               setShowText(true);
  }}
          >
            Submit
          </Button>
 
  </FormControl>
</div>
    }
    {selectedOption === 'meterSrNo' &&
      <div className=" areawise-container" style={{flexDirection : 'row'}}
     >
     <div className="custom-form-control3">

  <Grid container spacing={2} alignItems="center">
    {/* Search Field */}
    <Grid item xs={12} sm={8}>
      <TextField
        label="Search by Meter"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
      />
    </Grid>
    </Grid>
    <Button style={{ 
      backgroundColor : '#7b235b',
      color : 'white',
      flexDirection : 'row',
      width : 'auto',
      justifyContent : 'flex-start',
      marginLeft : '-200px'

    }}>
            Submit
          </Button>
          </div>

  
</div>


    }
  

    
      </div>
      <div className="showtext" >
      {showText && (
      <p style={{marginLeft:"50px",marginTop: "30px"  }}>Select the devices which are to be configured and click
       <span>
       <Button variant="outlined"
        style={{ marginLeft: "10px" }}
        sx={{
    '&:hover': {
      backgroundColor: '#7b235b', // Background color on hover
      color: 'white',            // Optional: text color on hover
    },
    '&:active': {
      backgroundColor: '#7b235b', // Background color on click
      color: 'white',            // Optional: text color on click
    },
  }}
  onClick={handleNextClick}
  >Next</Button>
</span></p>
 )}
</div>
      
      
   
      </div>
      <div className="showtable" >
      {showTable && (
        <table style={{ width: "120%", marginTop: "20px",marginLeft:"370px", borderCollapse: "collapse" }}>
          <thead style={{backgroundColor:"#7b235b",color:"white"  }}>
            <tr>
              <th>
                <input type="checkbox" 
                 checked={selectedIds.length === filteredData.length}
                 onChange={toggleSelectAll}
                 
                />
              </th>
              <th>Sr. No</th>
              <th>Meter SR. No</th>
             
              <th>Server url</th>
              <th>Server port</th>
              <th>Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record , index) => (
              <tr key={record.srno} style={{ textAlign: "center",borderBottom: "1px solid #ddd"  }}>
                <td>
                  <input type="checkbox"
                 
                 checked={selectedIds.includes(record.srno)}
                 onChange={() => toggleSelect(record.srno)}
                              />
                </td>
                <td>{record.srno}</td>
                <td>{record.metersrno}</td>
                
                <td>{record.Serverurl}</td>
                <td>{record.ServerPort}</td>
                <td>{record.status}</td>
                <td>{record.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
            
      
      </div>

      </div>
    );
  };
  



export default Server;
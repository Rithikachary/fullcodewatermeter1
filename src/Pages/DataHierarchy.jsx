import React, { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  TextField,
  FormControl,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "./DataHierarchy.css";

const DataHierarchy = () => {
  // State variables
  const [titles, setTitles] = useState([]);
  const [hierarchy, setHierarchy] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState({});
  const [formData, setFormData] = useState({});
  const [tableData, setTableData] = useState([]);

  // Fetch Auth Token
  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return null;
    }
    return token;
  };

  // Fetch hierarchy titles
  useEffect(() => {
    const fetchTitles = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await fetch(
          "http://14.195.14.194:8081/hierarchy/titles/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        setTitles(data);
      } catch (error) {
        console.error("Failed to fetch titles:", error);
      }
    };

    fetchTitles();
  }, []);

  // Fetch hierarchy data based on titleId and parentId
  const fetchHierarchyData = async (hierarchyTitleId, parentId = null) => {
    const token = getAuthToken();
    if (!token) return [];

    const url = `http://14.195.14.194:8081/hierarchy/data/titleId=${hierarchyTitleId}${
      parentId ? `/parentId=${parentId}` : ""
    }`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch hierarchy data:", error);
      return [];
    }
  };

  // Build hierarchy path and update dropdown options
  const buildHierarchyPath = async (selectedId) => {
    let path = [];
    let currentTitle = titles.find((title) => title.id === selectedId);
    const options = {};

    while (currentTitle) {
      path.unshift(currentTitle);
      const dropdownData = await fetchHierarchyData(currentTitle.id);
      options[currentTitle.id] = dropdownData.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      currentTitle = titles.find((title) => title.id === currentTitle.parentTitleId);
    }

    setHierarchy(path);
    setDropdownOptions(options);
  };

  // Handle Title Selection
  const handleSelectChange = async (selectedId) => {
    setSelectedTitle(selectedId);
    setFormData({});
    setDropdownOptions({});
    await buildHierarchyPath(selectedId);
  };

  // Handle Parent Selection Change
  const handleParentChange = async (levelId, event) => {
    const selectedId = event.target.value;
    setFormData((prevData) => ({ ...prevData, [levelId]: selectedId }));

    // Fetch next-level data
    const nextTitleIndex = hierarchy.findIndex((item) => item.id === levelId) + 1;
    if (nextTitleIndex < hierarchy.length) {
      const nextTitle = hierarchy[nextTitleIndex];
      const nextLevelData = await fetchHierarchyData(nextTitle.id, selectedId);

      setDropdownOptions((prevOptions) => ({
        ...prevOptions,
        [nextTitle.id]: nextLevelData.map((item) => ({ id: item.id, name: item.name })),
      }));
    }
  };

  // Handle Input Change
  const handleInputChange = (levelId, value) => {
    setFormData((prevData) => ({ ...prevData, [levelId]: value }));
  };

  // Handle Form Submission
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = getAuthToken();
  if (!token) return;

  // Ensure at least two levels are selected (State + one child level)
  if (!formData[hierarchy[0]?.id] || formData[hierarchy[0]?.id].trim() === "") {
    alert(`Please enter the ${hierarchy[0]?.title} name.`);
    return;
  }

  if (hierarchy.length > 1 && !formData[hierarchy[1]?.id]) {
    alert(`Please select a value for ${hierarchy[1]?.title}.`);
    return;
  }

  // Check if all fields are filled
  for (let i = 1; i < hierarchy.length; i++) { // Start checking from the second level
    const titleId = hierarchy[i].id;
    if (!formData[titleId] || formData[titleId].trim() === "") {
      alert(`Please fill in the field for ${hierarchy[i].title}.`);
      return;
    }
  }

  // Extract the last TextField (name) value
  const lastIndex = hierarchy.length - 1;
  const lastInputId = hierarchy[lastIndex]?.id;
  const parentInputId = hierarchy[lastIndex - 1]?.id;
  const selectedParentId = formData[parentInputId] || "";
  const hierarchyTitleId = hierarchy[lastIndex]?.id;

  // Submission Data
  const submissionData = {
    name: formData[lastInputId],
    parentId: selectedParentId,
    hierarchyTitleId: hierarchyTitleId,
  };

  try {
    const response = await fetch("http://14.195.14.194:8081/hierarchy/data", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      throw new Error(`Submission failed with status: ${response.status}`);
    }

    alert("Form submitted successfully!");

    // Clear only the last TextField input
    setFormData((prevData) => ({ ...prevData, [lastInputId]: "" }));
  } catch (error) {
    console.error("Submission error:", error);
    alert("Failed to submit the form.");
  }
};




// Fetch Table Data (Added inside useEffect)
useEffect(() => {
  fetchTableData();
}, []);

const fetchTableData = async () => {
  const token = getAuthToken();
  if (!token) return;

  try {
    const response = await fetch(" http://14.195.14.194:8081/hierarchy/data/all ",
     {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    setTableData(data);
  } catch (error) {
    console.error("Failed to fetch table data:", error);
  }
};




  return (
    <div className="data-hierarchy">
      <div className="hierarchy">
        <h3>Add Data Hierarchy</h3>
        <p className="delete-text">
          In Add Data Hierarchy option, we can add data as per the admin requirement.
        </p>
        <Divider />

        {/* Title Selection */}
        <div className="hierarchy-data1">
          <div className="hierarchy-form1">
            <FormControl className="custom-form-control" variant="outlined">
              <div className="label-input-container">
                <label className="custom-label">Select a Title:</label>
                <Select
                value={selectedTitle}
                onChange={(e) => handleSelectChange(e.target.value)}
                className="custom-select"
                >
                  <MenuItem value="">Select a Title</MenuItem>
                  {titles.map((title) => (
                    <MenuItem key={title.id} value={title.id}>
                      {title.title}
                      </MenuItem>
                    ))}
                    </Select>
                    </div>
                    </FormControl>
                    </div>
                    </div>


        {/* Hierarchy Path */}
        {hierarchy.length > 0 && (
          <form onSubmit={handleSubmit} className="hierarchy-data1">
            <h4>Hierarchy Path:</h4>
            {hierarchy.map((title, index) => (
              <div key={title.id} className="label-input-container">
                <label className="custom-label">
                  {index === hierarchy.length - 1 ? `Enter ${title.title} Name:` : `Select ${title.title}:`}
                </label>
                {index === hierarchy.length - 1 ? (
                  <TextField variant="outlined" className="custom-input-text" placeholder={`Enter ${title.title} name`} value={formData[title.id] || ""} onChange={(e) => handleInputChange(title.id, e.target.value)} />
                ) : (
                  <Select value={formData[title.id] || ""} onChange={(e) => handleParentChange(title.id, e)} className="custom-input">
                    <MenuItem value="">Select {title.title}</MenuItem>
                    {(dropdownOptions[title.id] || []).map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </div>
            ))}
            <Button type="submit" sx={{ backgroundColor: "#7b235b", color: "white" }}>
              Submit
            </Button>
          </form>
        )}
        <HierarchyDataTable hierarchy={titles} tableData={tableData} />
      </div>
      
    </div>
  );
};

const HierarchyDataTable = ({ hierarchy, tableData }) => {
  if (!hierarchy.length || !tableData.length) return null;

  // Create a map for quick lookup of hierarchy data by ID
  const hierarchyMap = tableData.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  // Function to trace hierarchy path for a given item
  const getHierarchyPath = (item) => {
    const path = [];
    let currentItem = item;

    while (currentItem) {
      path.unshift(currentItem);
      currentItem = currentItem.parentId ? hierarchyMap[currentItem.parentId] : null;
    }

    return path;
  };
  const validEntries = tableData.filter(row => 
    row.state && row.state !== "-" &&
    row.zone && row.zone !== "-" &&
    row.circle && row.circle !== "-" &&
    row.area && row.area !== "-" &&
    row.consumer && row.consumer !== "-"
  );
  

  return (
    <div className="data-table">
  <Table>
    <TableHead>
      <TableRow>
        {hierarchy.map((title) => (
          <TableCell key={title.id} style={{ fontWeight: "bold", textAlign: "left" , color : "white" }}>
            {title.title}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {tableData
        .filter(row => {
          const hierarchyPath = getHierarchyPath(row);
          return hierarchyPath.length >= 5 && hierarchyPath.every(level => level?.name && level.name !== "-");
        })
        .sort((a, b) => {
          const stateA = getHierarchyPath(a)[0]?.name || "";
          const stateB = getHierarchyPath(b)[0]?.name || "";
          return stateA.localeCompare(stateB); // Sorts alphabetically by state name
        })
        .map((row, index) => {
          const hierarchyPath = getHierarchyPath(row);

          return (
            <TableRow key={index}>
              {hierarchy.map((title, colIndex) => {
                const levelItem = hierarchyPath[colIndex] || {};
                return <TableCell key={title.id}>{levelItem.name || "-"}</TableCell>;
              })}
            </TableRow>
          );
        })}
    </TableBody>
  </Table>
</div>

  
  );
};

export default DataHierarchy;


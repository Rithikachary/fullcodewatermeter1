import React, { useState, useEffect } from "react";
import "./MeterMap.css";
import { Divider, FormControl, Button } from "@mui/material";
import chroma from "chroma-js";
import Select, { StylesConfig } from "react-select";

const Metermap = () => {
  const [titles, setTitles] = useState([]); // Stores the hierarchy titles
  const [dropdownOptions, setDropdownOptions] = useState({}); // Stores options for each dropdown
  const [hierarchy, setHierarchy] = useState([]); // Current hierarchy path
  const [meters, setMeters] = useState([]); // Stores meters data
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [consumerId, setConsumerId] = useState("");
  const [address, setAddress] = useState(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    can: "",
    email: "",
    street: "",
    area: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    consumerId: "",
    meterId: [] // Initialize as an array for multi-select
  });

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
    const fetchTitles = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        const response = await fetch("http://14.195.14.194:8081/hierarchy/titles/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setTitles(data);
      } catch (error) {
        console.error("Failed to fetch titles:", error);
      }
    };
    fetchTitles();
  }, []);

  const fetchHierarchyData = async (hierarchyTitleId, parentId = null) => {
    const token = getAuthToken();
    if (!token) return [];
    const url = `http://14.195.14.194:8081/hierarchy/data/titleId=${hierarchyTitleId}${
      parentId ? `/parentId=${parentId}` : ""
    }`;
    try {
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch hierarchy data:", error);
      return [];
    }
  };

  const buildHierarchyPath = async () => {
    const path = [];
    const options = {};

    for (let i = 0; i < titles.length; i++) {
      const currentTitle = titles[i];
      path.push(currentTitle);
      const dropdownData = await fetchHierarchyData(currentTitle.id);
      options[currentTitle.id] = dropdownData.map((item) => ({
        id: item.id,
        name: item.name
      }));
    }

    setHierarchy(path);
    setDropdownOptions(options);
  };

  useEffect(() => {
    if (titles.length > 0) {
      buildHierarchyPath();
    }
  }, [titles]);

  const handleParentChange = async (levelId, event) => {
    const selectedId = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [levelId]: selectedId,
      consumerId: selectedId // Ensure consumerId is updated
    }));

    const nextTitleIndex = hierarchy.findIndex((item) => item.id === levelId) + 1;
    if (nextTitleIndex < hierarchy.length) {
      const nextTitle = hierarchy[nextTitleIndex];
      const nextLevelData = await fetchHierarchyData(nextTitle.id, selectedId);
      setDropdownOptions((prevOptions) => ({
        ...prevOptions,
        [nextTitle.id]: nextLevelData.map((item) => ({
          id: item.id,
          name: item.name
        }))
      }));
    }
  };

  // Fetch address details when consumerId changes
  useEffect(() => {
    const fetchAddress = async () => {
      if (!formData.consumerId) return;
      setError("");
      setAddress(null);
      const token = getAuthToken();
      if (!token) return;
      const url = `http://14.195.14.194:8081/data/address/consumerId=${formData.consumerId}`;
      try {
        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error("Address not found");
        const data = await response.json();
        setAddress(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchAddress();
  }, [formData.consumerId]);

  useEffect(() => {
    const fetchMeters = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        const response = await fetch("http://14.195.14.194:8081/data/meter/unMappedMeters", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch meters");
        }
        const data = await response.json();
        setMeters(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchMeters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPreviewOpen(true);
    const token = getAuthToken();
    if (!token) return;

    const payload = {
      consumerId: formData.consumerId,
      address: {
        street: formData.street,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode
      },
      existingAddress: null,
      meterIds: formData.meterId // Now an array of meter IDs
    };

    try {
      const response = await fetch("http://14.195.14.194:8081/data/meter/consumer/mapping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        alert("Data submitted successfully!");
      } else {
        alert("Failed to submit data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data");
    }
  };

  // For previewing data (if needed)
  const getPreviewData = () => {
    const hierarchyData = {};
    const meterInfo = {};
    const consumerDetails = {};

    Object.keys(formData).forEach((key) => {
      const hierarchyTitle = titles.find((title) => title.id === key);
      const displayKey = hierarchyTitle ? hierarchyTitle.title : key;
      if (dropdownOptions[key]) {
        const selectedOption = dropdownOptions[key].find((item) => item.id === formData[key]);
        hierarchyData[displayKey] = selectedOption ? selectedOption.name : formData[key];
      } else if (key === "meterSrNo") {
        const selectedMeter = meters.find((meter) => meter.id === formData[key]);
        meterInfo["Meter Serial Number"] = selectedMeter ? selectedMeter.meterSrNo : formData[key];
      } else {
        consumerDetails[key] = formData[key];
      }
    });

    consumerDetails["Consumer Name"] = document.getElementById("firstName")?.value || "";
    consumerDetails["Phone"] = document.getElementById("phone")?.value || "";
    consumerDetails["CAN"] = document.getElementById("can")?.value || "";
    consumerDetails["Email"] = document.getElementById("email")?.value || "";
    consumerDetails["Type"] = document.getElementById("addtype")?.value || "";
    consumerDetails["Full Address"] = document.getElementById("fullAddress")?.value || "";

    return { hierarchyData, meterInfo, consumerDetails };
  };

  useEffect(() => {
    console.log("Form Data Consumer ID:", formData.consumerId);
  }, [formData.consumerId]);

  const colourStyles = {
    control: (styles, { isFocused }) => ({
      ...styles,
      borderColor: isFocused ? "#7b235b" : "#ccc", // Border color
      boxShadow: isFocused ? "0 0 0 2px rgba(123, 35, 91, 0.3)" : "none",
      "&:hover": {
        borderColor: "#7b235b",
      },
    }),
    menu: (styles) => ({
      ...styles,
      zIndex: 9999, // Ensures dropdown is visible above other elements
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#7b235b" // Selected option background
        : isFocused
        ? "rgba(123, 35, 91, 0.2)" // Hover effect
        : "white",
      color: isSelected ? "white" : "#7b235b", // Text color
      "&:hover": {
        backgroundColor: "rgba(123, 35, 91, 0.3)",
        color: "#7b235b",
      },
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: "#7b235b", // Background of selected tags
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: "white", // Text color inside selected tags
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "white",
      "&:hover": {
        backgroundColor: "#5a1c46", // Slightly darker on hover
      },
    }),
    placeholder: (styles) => ({
      ...styles,
      color: "#7b235b", // Placeholder text color
    }),
    singleValue: (styles) => ({
      ...styles,
      color: "#7b235b", // Selected value text color
    }),
  };
  
  

  return (
    <div className="meter-mapping">
      <div className="meter-map">
        <h1 className="title">Meter Mapping</h1>
        <p className="description">
          This screen allows the admin to map meters by selecting the appropriate hierarchy and filling in customer details.
        </p>
        <Divider />
        <div className="form-container">
          <div className="hierarchy-section">
            <h2>Hierarchy Selection</h2>
            {hierarchy.length > 0 &&
              hierarchy.map((title) => (
                <FormControl key={title.id} className="custom-form-control">
                  <div className="form-group">
                    <label htmlFor={title.id}>{title.title}</label>
                    <select
                      id={title.id}
                      className="meter-dropdown"
                      value={formData[title.id] || ""}
                      onChange={(e) => handleParentChange(title.id, e)}
                    >
                      <option value="">Select {title.title}</option>
                      {(dropdownOptions[title.id] || []).map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormControl>
              ))}
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            onClick={() => setShowCustomerDetails(!showCustomerDetails)}
          >
            New Address
          </button>

          {address && address.length > 0 ? (
            <>
              <div className="address-section">
                <h3>Address Details</h3>
                {address.map((addr) => (
                  <div key={addr.id} className="mb-4 p-4 border rounded">
                    <span className="text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded">
                      {addr.addressType}
                    </span>
                    <p className="text-lg font-semibold">{addr.street}</p>
                    <p>
                      {addr.city}, {addr.state}, {addr.postalCode}
                    </p>
                    <p>{addr.country}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div></div>
          )}

          {showCustomerDetails && (
            <div className="customer-details-section">
              <h2>Add Address Here</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="street">Street</label>
                  <input
                    type="text"
                    id="street"
                    className="text-input"
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="area">Area</label>
                  <input
                    type="text"
                    id="area"
                    className="text-input"
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    className="text-input"
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    className="text-input"
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text"
                    id="country"
                    className="text-input"
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    className="text-input"
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    required
                  />
                </div>
              </form>
            </div>
          )}

          <div className="meter-section">
            <h2>Meter Details</h2>
            <FormControl className="custom-form-control" variant="outlined" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="meterId">Meter Serial Number</label>
                <Select
                  id="meterId"
                  className="meter-dropdown-details"
                  isMulti
                  options={meters.map((meter) => ({
                    value: meter.id,
                    label: meter.meterSrNo,
                    color: "#7b235b" // Add dynamic color if needed
                  }))}
                  styles={colourStyles}
                  value={meters
                    .filter((meter) =>
                      formData.meterId?.includes(meter.id)
                    )
                    .map((meter) => ({
                      value: meter.id,
                      label: meter.meterSrNo,
                      color: "#7b235b"
                    }))}
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      meterId: selected ? selected.map((option) => option.value) : []
                    })
                  }
                  placeholder="Select Meter(s)..."
                  isClearable
                  closeMenuOnSelect={false}
                />
               
              </div>
              <div className="button-group">
                  <button type="submit" className="save-button" onClick={handleSubmit}>
                    Save
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setFormData({})}
                  >
                    Clear
                  </button>
                </div>
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metermap;

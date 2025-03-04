import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Divider, FormControl , IconButton  } from "@mui/material";
import './HierarchyTitle.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { LaptopChromebook } from "@mui/icons-material";

const HierarchyTitle = () => {
  const [formData1, setFormData1] = useState({
    parentTitleId: "",
    childValues: {},
  });

  const [formData2, setFormData2] = useState({
    title: "",
    parentTitleId: "",
    childValues: {},
  });

  const [topLevelHierarchies, setTopLevelHierarchies] = useState([]);
  const [children1, setChildren1] = useState([]);
  const [children2, setChildren2] = useState([]);
  const [hierarchyTitles, setHierarchyTitles] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch Auth Token
  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError(true);
      setErrorMessage("You are not authenticated. Please log in.");
      return null;
    }
    return token;
  };

  // Fetch Top-Level Hierarchies
  const fetchTopLevelTitles = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch("/api/hierarchy/titles/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTopLevelHierarchies(data.filter((title) => !title.parentTitleId));
        setHierarchyTitles(data);
      } else {
        const message = `Failed to fetch titles: ${response.status} - ${response.statusText}`;
        console.error(message);
        setError(true);
        setErrorMessage(message);
      }
    } catch (error) {
      console.error("Error fetching titles:", error);
      setError(true);
      setErrorMessage("Network error while fetching hierarchy titles.");
    }
  };

  useEffect(() => {
    fetchTopLevelTitles();
  }, []);

  // Fetch Children
  useEffect(() => {
    const fetchChildren = async (parentId, setChildren) => {
      if (!parentId) return;
      console.log(`Fetching children for parentId: ${parentId}`);
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await fetch(
          `/api/hierarchy/data/${parentId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setChildren(data);
        } else if (response.status === 404) {
          console.warn(`No children found for parentId: ${parentId}`);
          setChildren([]);
        } else {
          const message = `Failed to fetch children: ${response.status} - ${response.statusText}`;
          console.error(message);
          setError(true);
          setErrorMessage(message);
        }
      } catch (error) {
        console.error("Error fetching children:", error);
        setError(true);
        setErrorMessage("Network error while fetching child data.");
      }
    };

    fetchChildren(formData1.parentTitleId, setChildren1);
    fetchChildren(formData2.parentTitleId, setChildren2);
  }, [formData1.parentTitleId, formData2.parentTitleId]);

  // Handle Add Hierarchy
  const handleAddHierarchy = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const payload = {
        title: formData2.title,
        parentTitleId: formData2.parentTitleId || null, // `null` indicates top-level parent
      };

      const response = await fetch("/api/hierarchy/titles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Hierarchy added successfully:", data);
        setFormData2({ title: "", parentTitleId: "", childValues: {} });
        setError(false);
        setErrorMessage("");
        await fetchTopLevelTitles();
      } else {
        console.error(`Failed to add hierarchy: ${response.status} - ${response.statusText}`);
        setError(true);
        setErrorMessage(`Failed to add hierarchy: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error adding hierarchy:", error);
      setError(true);
      setErrorMessage("Network error while adding hierarchy.");
    }
  };

  // Function to find the parent title name based on the ID
  const getParentTitleName = (parentId) => {
    const parentTitle = hierarchyTitles.find((title) => title.id === parentId);
    return parentTitle ? parentTitle.title : '';
  };

  // Handle Edit
  const handleEdit = (user) => {
    setFormData2({
      title: user.title,
      parentTitleId: user.parentTitleId || "",
      childValues: {}, // Modify if your API provides child values
    });
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`/api/hierarchy/titles/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Hierarchy deleted successfully");
        setHierarchyTitles((prev) => prev.filter((title) => title.id !== id));
      } else {
        console.error(`Failed to delete hierarchy: ${response.status} - ${response.statusText}`);
        setError(true);
        setErrorMessage(`Failed to delete hierarchy: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error deleting hierarchy:", error);
      setError(true);
      setErrorMessage("Network error while deleting hierarchy.");
    }
  };
  


  return (
    <div className="Manage-Hierarchy-header">
      <div className="Manage-Hierarchy">
        <h4 className="h4">Hierarchy Title</h4>
        <p className="delete-text">
          In Manage Hierarchy option, we can add titles to our website as per the admin requirement.
        </p>
        <Divider />
        <div className="hierarchy-data">
          <h4>Add Hierarchy Title</h4>
          <FormControl variant="outlined" className="form-hierarchy-title">

            <div className="hierarchy-form">
            <label>Hierarchy Title </label>
            <TextField
              name="title"
              value={formData2.title}
              onChange={(e) => setFormData2({ ...formData2, title: e.target.value })}
              required
            />
            </div>
            <div className="hierarchy-form">
            <label>Parent Title</label>
            <TextField
              
              name="parentTitleId"
              value={formData2.parentTitleId}
              onChange={(e) => setFormData2({ ...formData2, parentTitleId: e.target.value })}
              select
              style={{width : "200px" , height  :"50px"}}
            >
              <MenuItem value="">None (Top-level Parent)</MenuItem>
              {hierarchyTitles.map((title) => (
                <MenuItem key={title.id} value={title.id}>
                  {title.title}
                </MenuItem>
              ))}
            </TextField>
            </div>
            <div className="hierarchy-form" style={{justifyContent :"center" , alignItems : "center"}}>
            <Button
              variant="contained"
              style={{ backgroundColor: "#7b235b", marginTop: "20px", width: "100px" , justifyContent: "center" , alignItems  :"center" }}
              onClick={handleAddHierarchy}
            >
              Submit
            </Button>
            </div>
          </FormControl>
        </div>

        {/* Render the Table */}
        
        <h4 id="title">Hierarchy Titles</h4>
        <div className="table-container">
        <table id="users">
          <thead>
            <tr>
              <th>Title</th>
              <th>Parent</th>
              <th>Status</th>
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>
            {hierarchyTitles.map((user) => (
              <tr key={user.id}>
                <td>{user.title}</td>
                <td>{getParentTitleName(user.parentTitleId)}</td>
                <td>{user.status}</td>
                {/* <td>
                  {/* <IconButton onClick={() => handleEdit(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.title)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </td> */}

              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default HierarchyTitle;

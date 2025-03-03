import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Table = () => {
    const url = 'http://14.195.14.194:8081/hierarchy/titles/all';
  
    const [data, setData] = useState([]);
  
    useEffect(() => {
      axios.get(url).then((response) => setData(response.data));
    }, []);
  
    const renderTable = () => {
      return data.map((user) => {
        return (
          <tr key={user.title}> {/* Added unique key */}
            <td>{user.title}</td>
            <td>{user.parentTitleId}</td>
            <td>{user.status}</td> 
          </tr>
        );
      });
    };
  
    return (
      <div>
        <h1 id="title">API Table</h1>
        <table id="users"> 
          <thead>
            <tr>
              <th>Title</th>
              <th>Parent</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>{renderTable()}</tbody>
        </table>
      </div>
    );
};

export default Table;

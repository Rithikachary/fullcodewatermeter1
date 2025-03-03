import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = ({ title, endpoint }) => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        const result = await response.json();

        const labels = result.map(item => item.date);
        const communicatingDevices = result.map(item => item.communicatingDevices);
        const nonCommunicatingDevices = result.map(item => item.nonCommunicatingDevices);
        const notStartedDevices = result.map(item => item.notStartedDevices);

        setData({
          labels,
          datasets: [
            {
              label: "Communicating Devices",
              data: communicatingDevices,
              backgroundColor: "#062157",
            },
            {
              label: "Non-Communicating Devices",
              data: nonCommunicatingDevices,
              backgroundColor: "#3F5B93",
            },
            {
              label: "Not Started Devices",
              data: notStartedDevices,
              backgroundColor: "#C6D8FB",
            },
          ],
        });
      } catch (error) {
        console.error(`Error fetching ${title} data:`, error);
      }
    };

    fetchData();
  }, [endpoint, title]);

  return (
    <div className="chart-container">
      <h2>{title}</h2>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;

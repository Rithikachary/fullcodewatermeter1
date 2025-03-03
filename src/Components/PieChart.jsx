import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ title, endpoint }) => {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint);
        const result = await response.json();

        const onlineDevices = Number(result.mapped?.communication || 0) + Number(result.unMapped?.communication || 0);
        const offlineDevices = Number(result.mapped?.notInCommunication || 0) + Number(result.unMapped?.notInCommunication || 0);

        setData({
          labels: ["Online", "Offline"],
          datasets: [
            {
              data: [onlineDevices, offlineDevices],
              backgroundColor: ["#062157", "#C6D8FB"],
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
      <Pie data={data} />
    </div>
  );
};

export default PieChart;

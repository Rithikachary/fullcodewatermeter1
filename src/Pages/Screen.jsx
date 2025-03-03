import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "./Screen.css";

// Register the required elements
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Screen = () => {
  const [data, setData] = useState({
    totalDevices: 5000,
    onlineDevices: 4892,
    totalConsumption: "284.5 m³ ",
    alerts: 23,
    offlineDevices: 108,
    mappedMeters: 82,
    unmappedMeters: 26,
    deviceStatus: [98, 2],
    signalStrength: [
      { name: "Good Signal", value: 90 },
      { name: "Poor Signal", value: 10 },
    ],
  });

  const pieData = {
    labels: ["Online", "Offline"],
    datasets: [
      {
        data: [98, 2],
        backgroundColor: ["#2ECC71", "#E74C3C"],
      },
    ],
  };
  
  const signalData = {
    labels: ["Good Signal", "Poor Signal"],
    datasets: [
      {
        data: [90, 10],
        backgroundColor: ["#2ECC71", "#F39C12"],
      },
    ],
  };
  
  return (
    <div className="screen">
      <div className="screen1">
        <div className="p-6 bg-white text-gray-900 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Water Meter Dashboard</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
             <div className="card" > <Card title="Total Devices" value={data.totalDevices} /> </div>
             <div className="card" >  <Card title="Online Devices" value={data.onlineDevices} /> </div>
             <div className="card" >  <Card title="Total Consumption" value={data.totalConsumption} /> </div>
             <div className="card" >  <Card title="Alerts" value={data.alerts} /> </div>
          </div>

          {/* Device and Signal Strength Charts */}
          <div className="grid grid-cols-2 gap-8 mt-4" style={{marginTop : "15px" }}>
            {/* Left Section */}
            <div className="card">
             <Card title="Offline Devices" value={data.offlineDevices} /> 
              <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="card" >  <Card title="Mapped Meters" value={data.mappedMeters} /> </div>
              <div className="card" >  <Card title="Unmapped Meters" value={data.unmappedMeters} /> </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="card">
            <div className="grid grid-cols-2 gap-8 mt-4">
  <PieChartComponent title="Device Status" data={pieData} />
  <BarChartComponent title="Signal Strength" data={signalData} />
</div>

            </div>
          </div>

          {/* Dropdown Filters */}
          <div className="mt-6 bg-gray-100 p-4 rounded-xl grid grid-cols-5 gap-4" style={{marginTop  :" 15px"}}>
            <Dropdown title="Select State" />
            <Dropdown title="Select Region" />
            <Dropdown title="Select Zone" />
            <Dropdown title="Select Circle" />
            <Dropdown title="Select Area" />
          </div>
        </div>
      </div>
      </div>
    
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white shadow-md rounded-xl p-4 text-center">
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-xl font-bold">{value}</p>
  </div>
);
const PieChartComponent = ({ title, data }) => {
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.datasets[0].data,
          backgroundColor: data.datasets[0].backgroundColor,
        },
      ],
    };
  
    return (
      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <Pie data={chartData} />
      </div>
    );
  };
  
  const BarChartComponent = ({ title, data }) => {
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          label: title,
          data: data.datasets[0].data,
          backgroundColor: data.datasets[0].backgroundColor,
        },
      ],
    };
  
    return (
      <div className="bg-white shadow-md rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <Bar data={chartData} />
      </div>
    );
  };
  

const Dropdown = ({ title }) => (
  <div className="bg-white shadow-md rounded-xl p-2">
    <select className="w-full p-2 border rounded-lg">
      <option>{title}</option>
    </select>
  </div>
);

export default Screen;

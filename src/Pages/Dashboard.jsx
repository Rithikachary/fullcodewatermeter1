import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "./Dashboard.css";
import { BarChart,  CartesianGrid, XAxis, YAxis} from "recharts";


ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [data, setData] = useState({
    totalDevices: 0,
    onlineDevices: 0,
    totalConsumption: "284.5 m³ ",
    alerts: 23,
    offlineDevices: 0,
    mappedMeters: 0,
    unmappedMeters: 0,
    deviceStatus: [0, 0 , 0 ,],
    signalStrength: [
      { name: "Good Signal", value: 90 },
      { name: "Poor Signal", value: 10 },
    ],
    weeklyStatus: [], // Add this
  });

  const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return null;
    }
    return token;
  };

  useEffect(() => {
    const fetchTotalDevices = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await fetch(
          "http://14.195.14.194:8081/data/dashboard/presentDay/status",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch total devices count");
        }

        const responseData = await response.json();
        console.log("API Response:", responseData); // ✅ Debugging log

        if (!responseData || !responseData.mapped || !responseData.unMapped) {
          console.error("Invalid API response:", responseData);
          return;
        }

        const mappedComm = Number(responseData.mapped?.communication || 0);
        const mappedNotComm = Number(responseData.mapped?.notInCommunication || 0);
        const mappedNotStarted = Number(responseData.mapped?.notStarted || 0);

        const unMappedComm = Number(responseData.unMapped?.communication || 0);
        const unMappedNotComm = Number(responseData.unMapped?.notInCommunication || 0);
        const unMappedNotStarted = Number(responseData.unMapped?.notStarted || 0);

        const mappedDevices = mappedComm + mappedNotComm + mappedNotStarted;
        const unmapped =  unMappedNotComm + unMappedNotStarted;
        const unmappedDevices = unMappedComm + unMappedNotComm + unMappedNotStarted;
        const totalDevices = mappedDevices + unmappedDevices;
        const onlineDevices = mappedComm + unMappedComm;
        const offlineDevices = totalDevices - onlineDevices;

        console.log("Total Devices:", totalDevices);
        console.log("Online Devices:", onlineDevices);
        console.log("Offline Devices:", offlineDevices);

        setData((prevData) => ({
          ...prevData,
          totalDevices,
          onlineDevices,
          onlineDevicesMapped : mappedComm,
          onlineDevicesUnMapped : unMappedComm,
          offlineDevices,
          mappedMeters: mappedDevices,
          unmappedMeters: unmapped,
          deviceStatus: [onlineDevices, offlineDevices],
        }));
      } catch (error) {
        console.error("Error fetching total devices:", error);
      }
    };

    fetchTotalDevices();
  }, []);

  const pieData = {
    labels: ["Online", "Offline"],
    datasets: [
      {
        data: data.deviceStatus,
        backgroundColor: ["#2ECC71", "#E74C3C"],
      },
    ],
  };


  useEffect(() => {
    const fetchWeeklyStatus = async () => {
      const token = getAuthToken();
      if (!token) return;
  
      try {
        const response = await fetch(
          "http://14.195.14.194:8081/data/dashboard/week/status",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch weekly status data");
        }
  
        const responseData = await response.json();
        console.log("Weekly Status API Raw Response:", responseData);
  
        if (!Array.isArray(responseData)) {
          console.error("Unexpected API response format:", responseData);
          return;
        }
  
        const formattedData = responseData.map((item) => ({
          date: item.commDate,
          communicatingDevices: (Number(item.communicationMapped) || 0) + (Number(item.communicationUnmapped) || 0),
          nonCommunicatingDevices: (Number(item.notCommunicationMapped) || 0) + (Number(item.notCommunicationUnmapped) || 0),
          notStartedDevices: (Number(item.notStartedMapped) || 0) + (Number(item.notStartedUnmapped) || 0),
        }));
        
        formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setData((prevData) => ({
          ...prevData,
          weeklyStatus: formattedData,
        }));
        
  
      } catch (error) {
        console.error("Error fetching weekly status:", error);
      }
    };
  
    fetchWeeklyStatus();
  }, []);
  

  
  const barChartData = {
    labels: data.weeklyStatus.map(item => item.date),
    datasets: [
      {
        label: "Communicating Devices",
        data: data.weeklyStatus.map(item => item.communicatingDevices),
        backgroundColor: "#2ECC71", // Green
      },
      {
        label: "Non-Communicating Devices",
        data: data.weeklyStatus.map(item => item.nonCommunicatingDevices),
        backgroundColor: "#E74C3C", // Red
      },
      {
        label: "Not Started Devices",
        data: data.weeklyStatus.map(item => item.notStartedDevices),
        backgroundColor: "#F39C12", // Orange
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
                 <div className="card" style={{textAlign : "start", height:"190px" , marginTop : '-10px'}}  > <Card title="Total Devices" value={data.totalDevices} /></div>
                 {/* <div className="card" >  <Card title="Online Devices" value={data.onlineDevices} /> </div> */}
                 <div className="grid grid-cols-2 gap-8 mt-4">
                 <div className="card" style={{ width  : "445px" ,textAlign : "start" ,   height : "190px" }}>
                 <Card title="Online Devices" value={data.onlineDevices} />
                  <div className="grid grid-cols-2 ">
                  <span title="Mapped Meters"><h3>Mapped Meters</h3>{data.onlineDevicesMapped}</span>
 
                   <span title="UnMapped Meters" ><h3>UnMapped Meters</h3>{data.onlineDevicesUnMapped} </span> 
                  </div>
                </div>
                <div className="card" style={{ width  : "465px" , textAlign : "start" , height : "190px" }}>
                 <Card title="Offline Devices" value={data.offlineDevices} /> 
                  <div className="grid grid-cols-2 gap-4 mt-4" >
                  <span title="Mapped Meters"><h3>Mapped Meters</h3>{data.mappedMeters} </span> 
                   <span title="Unmapped Meters"><h3>UnMapped Meters</h3>{data.unmappedMeters} </span>
                
                  </div>
                </div>
                </div>

                 
                 {/* <div className="card" style={{marginLeft : "500px"}} >   <Card title="Total Consumption" value={data.totalConsumption} /> </div>
                 <div className="card" >  <Card title="Alerts" value={data.alerts} /> </div> */}
              </div>
    
              {/* Device and Signal Strength Charts */}
              <div className="grid grid-cols-2 gap-8 mt-4" style={{marginTop : "15px"  }}>
                {/* Left Section */}
                <div className="card-graph" style={{width : "820px"}}>
                <Bar data={barChartData} />

</div>


                
    
                {/* Right Section */}
                <div className="card-graph">
                <div className="grid grid-cols-2 gap-8 mt-4">
      <PieChartComponent title="Device Status" data={pieData} />
      {/* <BarChartComponent title="Signal Strength" data={signalData} /> */}
    </div>
    
                </div>
              </div>
    
              {/* Dropdown Filters */}
              {/* <div className="mt-6 bg-gray-100 p-4 rounded-xl grid grid-cols-5 gap-4" style={{marginTop  :" 15px"}}>
                <Dropdown title="Select State" />
                <Dropdown title="Select Region" />
                <Dropdown title="Select Zone" />
                <Dropdown title="Select Circle" />
                <Dropdown title="Select Area" />
              </div> */}
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
    
    export default Dashboard;

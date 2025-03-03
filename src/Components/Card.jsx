import React, { useState, useEffect } from "react";

const CardsComponent = () => {
  const [deviceData, setDeviceData] = useState({
    totalDevices: 0,
    onlineDevices: 0,
    offlineDevices: 0,
    mappedMeters: 0,
    unmappedMeters: 0,
    onlineDevicesMapped: 0,
    onlineDevicesUnMapped: 0,
    deviceStatus: [0, 0],
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
        const unmapped = unMappedNotComm + unMappedNotStarted;
        const unmappedDevices = unMappedComm + unMappedNotComm + unMappedNotStarted;
        const totalDevices = mappedDevices + unmappedDevices;
        const onlineDevices = mappedComm + unMappedComm;
        const offlineDevices = totalDevices - onlineDevices;

        setDeviceData({
          totalDevices,
          onlineDevices,
          onlineDevicesMapped: mappedComm,
          onlineDevicesUnMapped: unMappedComm,
          offlineDevices,
          mappedMeters: mappedDevices,
          unmappedMeters: unmapped,
          deviceStatus: [onlineDevices, offlineDevices],
        });
      } catch (error) {
        console.error("Error fetching total devices:", error);
      }
    };

    fetchTotalDevices();
  }, []);

  const Card = ({ title, value }) => (
    <div className="bg-white shadow-md rounded-xl p-4 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="card" style={{ textAlign: "start", height: "190px", marginTop: "-10px" }}>
        <Card title="Total Devices" value={deviceData.totalDevices} />
      </div>

      <div className="grid grid-cols-2 gap-8 mt-4">
        <div className="card" style={{ width: "445px", textAlign: "start", height: "190px" }}>
          <Card title="Online Devices" value={deviceData.onlineDevices} />
          <div className="grid grid-cols-2">
            <span title="Mapped Meters">
              <h3>Mapped Meters</h3>
              {deviceData.onlineDevicesMapped}
            </span>
            <span title="UnMapped Meters">
              <h3>UnMapped Meters</h3>
              {deviceData.onlineDevicesUnMapped}
            </span>
          </div>
        </div>

        <div className="card" style={{ width: "465px", textAlign: "start", height: "190px" }}>
          <Card title="Offline Devices" value={deviceData.offlineDevices} />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <span title="Mapped Meters">
              <h3>Mapped Meters</h3>
              {deviceData.mappedMeters}
            </span>
            <span title="Unmapped Meters">
              <h3>UnMapped Meters</h3>
              {deviceData.unmappedMeters}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsComponent;

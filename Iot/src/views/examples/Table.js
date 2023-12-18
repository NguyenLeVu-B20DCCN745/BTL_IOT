import React, { useEffect, useState } from "react";

const Table = () => {
  const [environmentData, setEnvironmentData] = useState({
    temperature: 25,
    humidity: 300,
    moisture: 1,
    dust: 25,
  });

  const randomizeValues = () => {
    setEnvironmentData({
      temperature: Math.floor(Math.random() * 100),
      humidity: Math.floor(Math.random() * 500),
      Moisture: parseFloat(Math.random() * 100).toFixed(3),
      dust: Math.floor(Math.random() * 100),
    });
  };

  useEffect(() => {
    randomizeValues();
    const interval = setInterval(randomizeValues, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Temperature</td>
            <td>{environmentData.temperature}°C</td>
          </tr>
          <tr>
            <td>Humidity</td>
            <td>{environmentData.humidity}%</td>
          </tr>
          <tr>
            <td>Moisture</td>
            <td>{environmentData.moisture}</td>
          </tr>
          <tr>
            <td>Dust</td>
            <td>{environmentData.dust}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;

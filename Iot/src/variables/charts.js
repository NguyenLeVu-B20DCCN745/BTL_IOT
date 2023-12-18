import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const ChartComponent = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      // {
      //   label: "Temperature",
      //   data: [],
      //   fill: false,
      //   borderColor: "rgba(255, 0, 0, 0.7)",
      // },
      // {
      //   label: "Humidity",
      //   data: [],
      //   fill: false,
      //   borderColor: "rgba(0, 255, 0, 0.7)",
      // },
      {
        label: "Moisture_level",
        data: [],
        fill: false,
        borderColor: "rgba(0, 0, 255, 0.7)",
      },
      // {
      //   label: "Dust",
      //   data: [],
      //   fill: false,
      //   borderColor: "rgba(255, 255, 0, 0.7)",
      // },
    ],
  });

  useEffect(() => {

    const fetchData = async () => {
      const response = await fetch('http://localhost:8000/api/sensor');
      const data = await response.json();
  
      const newLabels = [...chartData.labels, new Date().toLocaleTimeString()];
  
      //const newTemperatureData = [...chartData.datasets[0].data, data.temperature];
  
      //const newHumidityData = [...chartData.datasets[1].data, data.humidity];
  
      const newMoistureData = [...chartData.datasets[0].data, data.moisture_level];
  
      setChartData({
        labels: newLabels,
        datasets: [
          // {
          //   ...chartData.datasets[0],
          //   data: newTemperatureData
          // },
          // {  
          //   ...chartData.datasets[1],
          //   data: newHumidityData
          // },
          {
            ...chartData.datasets[2],
            data: newMoistureData
          }
        ]
      });
    }
  
    // Call API initially
    // fetchData();
  
    // Update chart data every 5s
    
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Update every 2 seconds

  return () => clearInterval(interval);

  
  }, [chartData]);

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default ChartComponent;

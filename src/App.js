import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";

export default function App() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "(X, Y) Data",
        data: [],
        fill: false,
        borderColor: "green",
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseY = await fetch("https://retoolapi.dev/o5zMs5/data");
        const responseX = await fetch("https://retoolapi.dev/gDa8uC/data");

        if (!responseY.ok || !responseX.ok) {
          throw new Error("Failed to fetch data");
        }

        const dataY = await responseY.json();
        const dataX = await responseX.json();

        const combinedData = dataX.map((itemX, index) => ({
          x: parseFloat(itemX.RandomNumber),
          y: parseFloat(dataY[index].RandomNumber),
        }));

        console.log("Combined data:", combinedData);

        const combinedDataLimited = combinedData.slice(0, 50);

        setChartData((prevChartData) => ({
          ...prevChartData,
          labels: combinedDataLimited.map((point) => point.x), // Assuming labels are provided from x-axis data
          datasets: [
            {
              label: "(X, Y) Data",
              data: combinedDataLimited.map((point) => ({
                x: point.x,
                y: point.y,
              })),
              fill: false,
              borderColor: "green",
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <h2>Data in Line Chart</h2>
      <div style={{ height: "400px", width: "800px" }}>
        {/* <canvas id="myChart"></canvas> */}
        <Line data={chartData} />
      </div>
    </div>
  );
}

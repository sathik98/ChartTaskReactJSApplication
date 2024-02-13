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
        backgroundColor: "rgba(255, 0, 0) ",
        borderColor: "rgba(255, 0, 0) ",
        pointBackgroundColor: "rgba(255, 0, 0) ",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5,
        borderWidth: 0,
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
          labels: combinedDataLimited.map((point) => point.x),
          datasets: [
            {
              label: "Dot Graph",
              data: combinedDataLimited,
              fill: false,

              backgroundColor: "rgba(255, 0, 0) ",
              borderColor: "rgba(255, 0, 0) ",
              pointBackgroundColor: "rgba(255, 0, 0) ",
              pointBorderColor: "#fff",
              pointBorderWidth: 1,
              pointRadius: 5,
              pointHoverRadius: 7,
              borderWidth: 0,
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
        <Line
          data={chartData}
          options={{
            plugins: {
              tooltip: {
                enabled: true,
                callbacks: {
                  label: (context) => {
                    const dataPoint = context.dataset.data[context.dataIndex];
                    return `Dot Graph: (${dataPoint.x.toFixed(
                      3
                    )}, ${dataPoint.y.toFixed(3)})`;
                  },
                },
              },
            },
            scales: {
              x: {
                type: "linear",
                min: 0,
                max: 1000,
                ticks: {
                  stepSize: 100,
                },
              },
              y: {
                type: "linear",
                min: 0,
                max: 1000,
                ticks: {
                  stepSize: 100,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

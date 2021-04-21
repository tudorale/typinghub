import React from "react";
import { Line } from "react-chartjs-2";

function Statistics(props: any) {
  return (
    <div className="graphic">
      <Line
        data={{
          labels: props.labels,
          datasets: [
            {
              label: props.title,
              data: props.wpm,
              backgroundColor: props.pointColor,
              fill: false,
              borderColor: props.lineColor,
              tension: 0,
              pointBorderColor: props.pointColor,
            },
          ],
        }}
        height={400}
        width={1600}
        options={{
          maintainAspectRatio: false,
          legend: {
            display: "none",
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  color: "#19171d",
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  color: "#19171d",
                },
              },
            ],
          },
        }}
      />
    </div>
  );
}

export default Statistics;

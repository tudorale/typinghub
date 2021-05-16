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
              lineTension: 0,
              borderColor: props.lineColor,
              pointBorderColor: props.pointColor,
            },
          ],
        }}
        height={400}
        width={1600}
        options={{
          maintainAspectRatio: false,
          layout: {
            padding: 5,
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  color: "#111825",
                },
                ticks: {
                  display: false,
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  color: "#111825",
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

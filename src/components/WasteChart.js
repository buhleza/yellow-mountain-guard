import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function WasteChart() {
  const labels = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"];
  const values = [18000, 25000, 12000, 30000];
  const average = 21250;

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Actual",
        data: values,
        borderColor: "#3eb489",
        backgroundColor: "rgba(62, 180, 137, 0.05)",
        pointBackgroundColor: values.map((v, i) =>
          i === values.length - 1 ? "#e74c3c" : "#3eb489"
        ),
        pointBorderColor: "white",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.35,
        fill: true,
        order: 1
      },
      {
        label: "Average",
        data: labels.map(() => average),
        borderColor: "#8fa38f",
        borderDash: [6, 6],
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        order: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: "#1a2a1e",
          usePointStyle: true,
          pointStyle: "line",
          boxWidth: 30,
          padding: 20,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#1a2a1e",
        bodyColor: "#5a6a5e",
        borderColor: "#e0e6e0",
        borderWidth: 1,
        callbacks: {
          label: (context) => ` ${context.parsed.y.toLocaleString()} tonnes`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "#5a6a5e", font: { size: 11 } },
        grid: { color: "rgba(208, 216, 208, 0.4)", drawBorder: false }
      },
      y: {
        min: 0,
        max: 36000,
        ticks: {
          color: "#5a6a5e",
          font: { size: 11 },
          stepSize: 9000,
          callback: (value) => value === 0 ? "0k" : value / 1000 + "k"
        },
        grid: { color: "rgba(208, 216, 208, 0.4)", drawBorder: false }
      }
    }
  };

  return (
    <div style={{ background: "#f4f6f8", padding: "30px", fontFamily: "Arial", color: "#1a2a1e" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ background: "white", border: "1px solid #e0e6e0", borderRadius: "10px", padding: "20px" }}>
          <p style={{ color: "#1a2a1e", margin: "0 0 5px 0", fontWeight: "bold" }}>
            WEEKLY WASTE TREND
          </p>
          <p style={{ color: "#5a6a5e", margin: "0 0 20px 0", fontSize: "13px" }}>
            Snake Park vicinity · tonnes per week
          </p>

          <div style={{ height: "280px" }}>
            <Line data={data} options={options} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", marginTop: "20px", flexWrap: "wrap" }}>
          <div style={{ background: "white", border: "1px solid #e0e6e0", borderRadius: "10px", padding: "18px", flex: "1", minWidth: "180px" }}>
            <p style={{ color: "#5a6a5e", margin: 0, fontSize: "11px", letterSpacing: "1px" }}>4-WEEK TOTAL</p>
            <p style={{ fontSize: "22px", margin: "8px 0 0 0", color: "#1a2a1e", fontWeight: "bold" }}>85 000t</p>
          </div>

          <div style={{ background: "white", border: "1px solid #e0e6e0", borderRadius: "10px", padding: "18px", flex: "1", minWidth: "180px" }}>
            <p style={{ color: "#5a6a5e", margin: 0, fontSize: "11px", letterSpacing: "1px" }}>PEAK WEEK</p>
            <p style={{ fontSize: "22px", margin: "8px 0 0 0", color: "#1a2a1e", fontWeight: "bold" }}>30 000t</p>
          </div>

          <div style={{ background: "white", border: "1px solid #e0e6e0", borderRadius: "10px", padding: "18px", flex: "1", minWidth: "180px" }}>
            <p style={{ color: "#5a6a5e", margin: 0, fontSize: "11px", letterSpacing: "1px" }}>WEEKLY AVERAGE</p>
            <p style={{ fontSize: "22px", margin: "8px 0 0 0", color: "#1a2a1e", fontWeight: "bold" }}>21 250t</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default WasteChart;

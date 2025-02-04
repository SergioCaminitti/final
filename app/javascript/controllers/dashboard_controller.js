import { Controller } from "@hotwired/stimulus";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

// Connects to data-controller="dashboard"
export default class extends Controller {
  static values = { revenue: Array };
  initialize() {
    const revenueData = this.revenueValue;
    if (!revenueData || revenueData.length === 0) {
      console.error("Revenue data is empty or undefined");
      return;
    }

    const data = revenueData.map((item) => item[1]);
    const labels = revenueData.map((item) => item[0]);

    const ctx = document.getElementById("revenueChart");
    if (!ctx) {
      console.error("Canvas element for chart not found");
      return;
    }

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Revenue R$",
            data: data,
            borderWidth: 3,
            fill: true,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            border: {
              dash: [5, 5],
            },
            grid: {
              color: "#d4f3ef",
            },
            beginAtZero: true,
          },
        },
      },
    });
  }
}

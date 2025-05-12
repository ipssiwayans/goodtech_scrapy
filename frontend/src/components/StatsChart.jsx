import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
);

const StatsChart = ({ articles }) => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    articlesPerMonth: {},
    articlesPerDay: {},
  });

  useEffect(() => {
    if (!articles || articles.length === 0) return;

    const totalArticles = articles.length;

    const monthsData = {};
    const daysData = {};

    const now = new Date();
    const currentMonthKey = now.toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    });
    const currentDayKey = now.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });

    let currentMonthCount = 0;
    let currentDayCount = 0;

    articles.forEach((article) => {
      if (!article.date) return;

      const date = new Date(article.date);

      const monthKey = date.toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      });
      monthsData[monthKey] = (monthsData[monthKey] || 0) + 1;

      if (monthKey === currentMonthKey) {
        currentMonthCount++;
      }

      const dayKey = date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });
      daysData[dayKey] = (daysData[dayKey] || 0) + 1;

      if (dayKey === currentDayKey) {
        currentDayCount++;
      }
    });

    setStats({
      totalArticles,
      articlesPerMonth: monthsData,
      articlesPerDay: daysData,
      currentMonthCount,
      currentDayCount,
    });
  }, [articles]);

  const monthLabels = [];
  const monthData = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    });
    monthLabels.push(monthKey);
    monthData.push(stats.articlesPerMonth[monthKey] || 0);
  }

  const dayLabels = [];
  const dayData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    const dayKey = date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
    dayLabels.push(dayKey);
    dayData.push(stats.articlesPerDay[dayKey] || 0);
  }

  const barChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Articles par mois",
        data: monthData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: dayLabels,
    datasets: [
      {
        label: "Articles par jour",
        data: dayData,
        fill: false,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Statistiques des articles",
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold mb-2">Total des articles</h3>
          <p className="text-3xl font-bold">{stats.totalArticles}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold mb-2">Ce mois-ci</h3>
          <p className="text-3xl font-bold">{stats.currentMonthCount || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold mb-2">Aujourd'hui</h3>
          <p className="text-3xl font-bold">{stats.currentDayCount || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Articles par mois
          </h3>
          <Bar data={barChartData} options={options} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Articles par jour
          </h3>
          <Line data={lineChartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default StatsChart;

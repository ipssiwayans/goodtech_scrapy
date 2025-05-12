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
import { fetchCategories } from "../services/api";

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
  const [categoryStats, setCategoryStats] = useState({
    categories: [],
    total: 0,
    totalArticles: 0,
  });
  useEffect(() => {
    const loadCategoryStats = async () => {
      try {
        const data = await fetchCategories();
        setCategoryStats(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      }
    };
    loadCategoryStats();
  }, []);

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

  const categoryChartData = {
    labels: categoryStats.categories.map((cat) => cat.category),
    datasets: [
      {
        label: "Articles par catégorie",
        data: categoryStats.categories.map((cat) => cat.total_articles),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)",
          "rgba(83, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)",
          "rgba(83, 102, 255, 1)",
        ],
        borderWidth: 1,
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

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 20,
          boxWidth: 10,
        },
      },
      title: {
        display: true,
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
        <div className="col-span-1 md:col-span-2 flex flex-col gap-8">
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Articles par catégorie
            </h3>
            <div className="max-w-md mx-auto">
              <Pie data={categoryChartData} options={categoryOptions} />
            </div>
          </div>
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Détails des catégories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryStats.categories.map((category, index) => {
                const gradients = [
                  "from-blue-500 to-blue-600",
                  "from-green-500 to-green-600",
                  "from-purple-500 to-purple-600",
                  "from-red-500 to-red-600",
                  "from-yellow-500 to-yellow-600",
                  "from-indigo-500 to-indigo-600",
                  "from-pink-500 to-pink-600",
                  "from-teal-500 to-teal-600",
                ];
                const gradientClass = gradients[index % gradients.length];

                return (
                  <div
                    key={category.category}
                    className={`bg-gradient-to-r ${gradientClass} text-white p-5 rounded-lg shadow-md transform transition-transform hover:scale-105`}
                  >
                    <h4 className="font-bold text-xl mb-2 truncate">
                      {category.category}
                    </h4>
                    <div className="flex items-center mb-2">
                      <span className="text-3xl font-bold mr-2">
                        {category.total_articles}
                      </span>
                      <span className="text-sm opacity-90">articles</span>
                    </div>
                    <div className="text-xs opacity-80 mt-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(category.last_updated).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>


      
    </div>
  );
};

export default StatsChart;

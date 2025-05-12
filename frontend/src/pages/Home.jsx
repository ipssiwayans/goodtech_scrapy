import React from "react";
import ArticleList from "../components/ArticleList";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white text-center">
            #GoodTech Articles
          </h1>
          <p className="text-blue-100 text-center mt-2">
            Découvrez les dernières actualités tech positives
          </p>
        </div>
      </div>
      <ArticleList />
    </div>
  );
};

export default Home;

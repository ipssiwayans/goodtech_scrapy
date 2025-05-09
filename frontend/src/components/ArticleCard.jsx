import React from "react";

const ArticleCard = ({ article }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {article.image_url !== "Image non trouvée" ? (
        <img
          src={article.thumbnail_url}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          Aucune image
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {article.date
            ? new Date(article.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Date non disponible"}
        </p>
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Lire l'article
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;

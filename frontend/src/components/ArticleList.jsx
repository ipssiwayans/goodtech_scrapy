import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ArticleCard from "./ArticleCard";
import FilterMenu from "./FilterMenu";
import { fetchAllArticles } from "../services/api";

const ArticleList = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const articlesPerLoad = 10;

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const articles = await fetchAllArticles();
        setAllArticles(articles);
        setFilteredArticles(articles);
        setDisplayedArticles(articles.slice(0, articlesPerLoad));
        setHasMore(articles.length > articlesPerLoad);
      } catch (err) {
        setError("Erreur lors du chargement des articles");
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  useEffect(() => {
    let filtered = allArticles.filter((article) =>
      article.title.toLowerCase().includes(search.toLowerCase()),
    );

    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sort === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredArticles(filtered);
    setDisplayedArticles(filtered.slice(0, articlesPerLoad));
    setHasMore(filtered.length > articlesPerLoad);
  }, [search, sort, allArticles]);

  const loadMore = () => {
    const nextArticles = filteredArticles.slice(
      displayedArticles.length,
      displayedArticles.length + articlesPerLoad,
    );
    setDisplayedArticles([...displayedArticles, ...nextArticles]);
    setHasMore(
      displayedArticles.length + nextArticles.length < filteredArticles.length,
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Derniers articles #GoodTech
      </h1>
      <FilterMenu
        search={search}
        onSearch={setSearch}
        sort={sort}
        onSort={setSort}
      />
      {loading && <p className="text-center text-gray-600">Chargement...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && displayedArticles.length === 0 && (
        <p className="text-center text-gray-600">Aucun article trouvé.</p>
      )}
      <InfiniteScroll
        dataLength={displayedArticles.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<p className="text-center text-gray-600">Chargement...</p>}
        endMessage={
          <p className="text-center text-gray-600 mt-4">
            Tous les articles ont été chargés.
          </p>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((article) => (
            <ArticleCard key={article.url} article={article} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ArticleList;

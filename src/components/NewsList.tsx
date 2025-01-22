import React, { useEffect, useState } from "react";

const APP_NEWS_API_KEY = "dcce4bb3157b4d3ea6db57f086ba96b4";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: { name: string };
  publishedAt: string;
}

interface NewsListProps {
  mode: string;
}

const NewsList: React.FC<NewsListProps> = ({ mode }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [mode]);

  const fetchNews = async () => {
    try {
      const query =
        mode === "republican"
          ? "Republican Donald Trump News"
          : "Democrat Donald Trump News";
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1);
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          query
        )}&from=${fromDate.toISOString()}&sortBy=publishedAt&apiKey=${APP_NEWS_API_KEY}`
      );
      const data = await response.json();
      setNews(data.articles);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  return (
    <div className="mt-12 text-white w-full max-w-4xl">
      <h2 className="text-3xl font-bold mb-4">Latest News</h2>
      <ul className="space-y-4">
        {news.slice(0, showMore ? news.length : 5).map((article, index) => (
          <li
            key={index}
            className="bg-white text-black p-4 rounded-lg shadow-lg"
          >
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold hover:underline"
            >
              {article.title}
            </a>
            <p className="text-sm text-gray-600">
              {article.source.name} -{" "}
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>
            <p className="mt-2">{article.description}</p>
          </li>
        ))}
      </ul>
      {news.length > 5 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="mt-4 px-6 py-3 bg-white text-black rounded-lg shadow-lg hover:bg-gray-300 transition"
        >
          {showMore ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default NewsList;

import React, { useEffect, useState } from "react";

interface NewsArticle {
  title: string;
  description: string;
  link: string;
  source: string;
  pubDate: string;
}

interface NewsListProps {
  mode: string; // "republican" or "democratic"
}

const NewsList: React.FC<NewsListProps> = ({ mode }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [mode]);

  const fetchNews = async () => {
    try {
      // Determine bias based on mode
      const bias = mode === "republican" ? "right" : "left";

      const response = await fetch(`/api/news/bias?bias=${bias}`);
      const data = await response.json();

      if (data.status === "success") {
        setNews(data.data);
      } else {
        console.error("Error fetching news:", data);
        setNews([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    }
  };

  return (
    <div className="mt-12 text-white w-full max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-4 text-center">Latest News</h2>
      <ul className="space-y-4">
        {news.slice(0, showMore ? news.length : 5).map((article, index) => (
          <li
            key={index}
            className="bg-white text-black p-4 rounded-lg shadow-lg"
          >
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold hover:underline"
            >
              {article.title}
            </a>
            <p className="text-sm text-gray-600">
              {article.source} -{" "}
              {new Date(article.pubDate).toLocaleDateString()}
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

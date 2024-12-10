import React, { useEffect, useState } from "react";
import Footer from "./Footer"; // Ensure that Footer component is correctly implemented
import axios from "axios";

function Home() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("technology");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      const newsApiKey = "536861575ec841e98b93b69ec934cdcd"; // Ensure a valid API key
      setLoading(true);
      setError(""); // Reset error state before fetching

      try {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${newsApiKey}`
        );
        console.log("Response data:", response.data); // Log response data for debugging
        setData(response.data.articles || []); // Fallback to empty array if `articles` is undefined
      } catch (error) {
        console.error(
          "Error fetching data:",
          error?.response?.data || error.message
        ); // Log detailed error
        setError(
          "Failed to fetch news: " + (error?.message || "Unknown error")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [category]);

  const handleCategoryClick = (newCategory) => {
    setCategory(newCategory);
  };

  return (
    <>
      {/* Recent News Section */}
      <div className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Recent News - {category.charAt(0).toUpperCase() + category.slice(1)}
        </h2>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Show loading and error messages */}
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}

          {/* Display first 3 articles */}
          {data.slice(0, 3).map((article, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src={
                  article.urlToImage || "https://via.placeholder.com/600x400"
                }
                alt="News"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {article.title}
              </h3>
              <p className="text-gray-600 mt-2">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
              >
                Read more →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Main Blog Section */}
      <main className="container mx-auto py-10 px-6 flex gap-12">
        {/* Blog Posts */}
        <section className="w-2/3 space-y-10">
          {/* Sample Blog Posts */}
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/800x400"
              alt="Blog Post"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-3xl font-semibold text-gray-800 hover:text-blue-500 cursor-pointer">
                The Ultimate Guide to Tailwind CSS
              </h2>
              <p className="text-gray-600 mt-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                vel massa euismod, finibus purus ut, varius odio...
              </p>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
              >
                Read More &rarr;
              </a>
            </div>
          </article>

          {/* Additional posts... */}
        </section>

        {/* Sidebar Categories */}
        <aside className="w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800">Categories</h3>
            <ul className="mt-4 space-y-3 text-gray-600">
              {[
                "business",
                "technology",
                "sports",
                "health",
                "entertainment",
                "science",
              ].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full text-left hover:text-blue-600 ${
                      category === cat ? "font-semibold text-blue-600" : ""
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </>
  );
}

export default Home;

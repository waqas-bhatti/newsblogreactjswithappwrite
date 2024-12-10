import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Circles } from "react-loader-spinner";

function Blog() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0); // Total number of results

  const pageSize = 10; // Number of articles per page

  // Use React Router's hooks to read and update the URL
  const location = useLocation();
  const navigate = useNavigate();

  // Get the page number from the URL (query parameters)
  const queryParams = new URLSearchParams(location.search);
  const page = parseInt(queryParams.get("page")) || 1;

  useEffect(() => {
    const fetchNews = async () => {
      const newsApikey = "YOUR_API_KEY";
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=tesla&from=2024-10-09&sortBy=publishedAt&pageSize=${pageSize}&page=${page}&apiKey=${newsApikey}`
        );
        setData(response.data.articles);
        setTotalResults(response.data.totalResults);
      } catch (error) {
        console.error("Error details:", error?.response?.data || error.message);
        setError("Failed to load news.");
      } finally {
        setLoading(false);
      }
    };

    // Throttle requests with a delay
    const delay = setTimeout(fetchNews, 1000); // 1-second delay

    return () => clearTimeout(delay); // Cleanup timeout on unmount
  }, [page]);

  // Function to handle page changes
  const handleNextPage = () => {
    if (page * pageSize < totalResults) {
      navigate(`?page=${page + 1}`); // Update the URL with the next page number
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      navigate(`?page=${page - 1}`); // Update the URL with the previous page number
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Recent News
        </h2>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center h-96">
            <Circles
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="circles-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              loading={loading}
            />
          </div>
        )}

        {/* Error Message */}
        {error && <div className="text-center text-red-500">{error}</div>}

        {/* News Cards */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.length > 0 ? (
            data.map((article, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <img
                  src={
                    article.urlToImage || "https://via.placeholder.com/600x400"
                  } // Fallback if image is missing
                  alt="News image"
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
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-600">
              No news articles available.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalResults > pageSize && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handlePreviousPage}
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
              disabled={page * pageSize >= totalResults}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Blog;

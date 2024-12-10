import React, { useEffect, useState } from "react";
import appwriteService from "../../AppwriteStore/appStorageService";
import { LineWave } from "react-loader-spinner";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageViews, setPageViews] = useState(0);
  const dispatch = useDispatch();

  const [visits, setVisits] = useState(0);

  // Loading from localStorage
  useEffect(() => {
    const storedVisits = Number(localStorage.getItem("visitCounter")) || 0;
    setVisits(storedVisits + 1);
  }, []);

  // Saving in localStorage
  useEffect(() => {
    localStorage.setItem("visitCounter", visits);
  }, [visits]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const documents = await appwriteService.fetchDocument();
        const fetchImage = await Promise.all(
          documents.map(async (post) => {
            const imageUrl = post.featuredImage
              ? await appwriteService.getFilePreview(post.featuredImage)
              : "https://via.placeholder.com/150";
            return { ...post, imageUrl };
          })
        );

        fetchImage.sort(
          (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
        );
        setPosts(fetchImage);
      } catch (error) {
        console.log("Failed to fetch Post :: appwrite error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterByCategory = (category) => {
    const filteredPosts = posts.filter((post) => post.category === category);

    // Sort the filtered posts by createdAt timestamp to ensure latest posts come first
    filteredPosts.sort(
      (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
    );

    // Return the most recent post for the category (first post in the sorted array)
    return filteredPosts[0];
  };

  return (
    <>
      {loading ? (
        <LineWave
          visible={true}
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="line-wave-loading"
          wrapperClass="flex justify-center mt-6"
        />
      ) : null}

      <div className="max-w-7xl mx-auto py-12 px-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            📈 Page View Count: {visits}
          </h1>
          {/* The rest of your component */}
        </div>
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Recent News
        </h2>

        {/* Main Posts Section */}
        <div className="flex flex-col sm:flex-row gap-8 mb-12">
          {/* Left Section */}
          {posts[0] && (
            <div key={posts[0].$id} className="w-full sm:w-1/2">
              <NavLink to={`/articles/${posts[0].$id}`}>
                <img
                  src={posts[0].imageUrl}
                  alt={posts[0].title}
                  className="w-full h-auto object-cover rounded-lg"
                />
                <h3 className="text-2xl font-semibold text-gray-800 hover:underline  ">
                  {posts[0].title}
                </h3>
              </NavLink>
              <p className="text-gray-600 mt-3 line-clamp-6 ">
                {posts[0].description}
              </p>
            </div>
          )}

          {/* Center Section */}
          {posts[1] && (
            <div key={posts[1].$id} className="w-full">
              <NavLink to={`/articles/${posts[1].$id}`}>
                <img
                  src={posts[1].imageUrl}
                  alt={posts[1].title}
                  className="w-full h-auto object-cover mb-4 rounded-lg"
                />
                <h3 className="text-2xl font-semibold text-gray-800 hover:underline">
                  {posts[1].title}
                </h3>
              </NavLink>
              <p className="text-gray-600 mt-3 line-clamp-6 ">
                {posts[1].description}
              </p>
            </div>
          )}

          {/* Right Section */}
          <div className="w-full sm:w-1/3">
            {posts.slice(2, 4).map((post) => (
              <NavLink to={`/articles/${post.$id}`} key={post.$id}>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-6">
                    {post.description}
                  </p>
                  <hr />
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Static Sections */}
        <div className="flex flex-col sm:flex-row gap-8 mb-12">
          {/* Culture Section */}
          <div className="border-t-2 border-blue-800 py-4">
            {/* Ensure that filterByCategory returns a valid post before trying to render */}
            {filterByCategory("culture") ? (
              <div key={filterByCategory("culture").$id}>
                <NavLink to={`/articles/${filterByCategory("culture").$id}`}>
                  <h1 className="text-2xl font-semibold text-gray-800 hover:underline">
                    Culture
                  </h1>
                  <h3 className="line-clamp-5 max-w-xs">
                    {filterByCategory("culture").title}
                  </h3>
                </NavLink>
              </div>
            ) : (
              <p>No posts available in this category.</p>
            )}
          </div>

          {/* Entertainment Section */}
          <div className="border-t-2 border-blue-800 py-4">
            {filterByCategory("entertainment") ? (
              <div key={filterByCategory("entertainment").$id}>
                <NavLink
                  to={`/articles/${filterByCategory("entertainment").$id}`}
                >
                  <h1 className="text-2xl font-semibold text-gray-800 hover:underline">
                    Entertainment
                  </h1>
                  <h3 className="line-clamp-5 max-w-xs">
                    {filterByCategory("entertainment").title}
                  </h3>
                </NavLink>
              </div>
            ) : (
              <p>No posts available in this category.</p>
            )}
          </div>

          {/* Sports Section */}
          <div className="border-t-2 border-blue-800 py-4">
            {filterByCategory("sports") ? (
              <div key={filterByCategory("sports").$id}>
                <NavLink to={`/articles/${filterByCategory("sports").$id}`}>
                  <h1 className="text-2xl font-semibold text-gray-800 hover:underline">
                    Sports
                  </h1>
                  <h3 className="line-clamp-5 max-w-xs">
                    {filterByCategory("sports").title}
                  </h3>
                </NavLink>
              </div>
            ) : (
              <p>No posts available in this category.</p>
            )}
          </div>

          {/* Travel Section */}
          <div className="border-t-2 border-blue-800 py-4">
            {filterByCategory("travel") ? (
              <div key={filterByCategory("travel").$id}>
                <NavLink to={`/articles/${filterByCategory("travel").$id}`}>
                  <h1 className="text-2xl font-semibold text-gray-800 hover:underline">
                    Travel
                  </h1>
                  <h3 className="line-clamp-5 max-w-xs">
                    {filterByCategory("travel").title}
                  </h3>
                </NavLink>
              </div>
            ) : (
              <p>No posts available in this category.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

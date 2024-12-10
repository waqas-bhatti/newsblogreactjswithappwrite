import { NavLink } from "react-router-dom";
import appwriteService from "../../AppwriteStore/appStorageService";
import { useEffect, useState } from "react";
import { LineWave } from "react-loader-spinner";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const documents = await appwriteService.fetchDocument();
        const fetchPost = await Promise.all(
          documents.map(async (post) => {
            const imageUrl = post.featuredImage
              ? await appwriteService.getFilePreview(post.featuredImage)
              : "https://via.placeholder.com/150"; // Ensure fallback
            return { ...post, imageUrl };
          })
        );

        fetchPost.sort(
          (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
        );

        setPosts(fetchPost);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {loading && (
        <LineWave
          visible={true}
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="line-wave-loading"
          wrapperClass="flex justify-center mt-6"
        />
      )}
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Header Section */}
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">
          Recent News
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          {posts[1] && (
            <div key={posts[1].$id} className="lg:col-span-2 flex flex-col">
              <NavLink to={`/articles/${posts[1].$id}`}>
                <h3 className="text-3xl font-semibold text-gray-800 mb-2 hover:underline">
                  {posts[1].title}
                </h3>
              </NavLink>
              <p className="text-gray-600 mb-4 line-clamp-2 ">
                {posts[1].description}
              </p>
              <img
                src={posts[1].imageUrl}
                alt={posts[1].title}
                className="w-full h-auto object-cover mb-8 rounded-lg"
              />
              <p className="text-gray-600 mb-4">{posts[1].description}</p>
            </div>
          )}

          <div>
            <h1 className="text-2xl font-semibold">Join Us</h1>
            <div class="flex items-center gap-6 p-3 justify-center ">
              <a
                class="text-gray-700 hover:text-orange-600"
                aria-label="Visit TrendyMinds Facebook"
                href=""
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  class="h-8"
                >
                  <path
                    fill="currentColor"
                    d="m279.14 288 14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                  ></path>
                </svg>
              </a>
              <a
                class="text-gray-700 hover:text-orange-600"
                aria-label="Visit TrendyMinds Instagram"
                href=""
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  class="h-8"
                >
                  <path
                    fill="currentColor"
                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                  ></path>
                </svg>
              </a>
              <a
                class="text-gray-700 hover:text-orange-600"
                aria-label="Visit TrendyMinds Twitter"
                href=""
                target="_blank"
              >
                <svg
                  class="h-8"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                  ></path>
                </svg>
              </a>
            </div>
            <div className="mt-2">
              {/* Right Section */}
              {posts[0] && (
                <NavLink to={`/articles/${posts[0].$id}`}>
                  <div key={posts[0].$id}>
                    <img
                      src={posts[0].imageUrl}
                      alt={posts[0].title}
                      className="w-full h-auto object-cover mb-3 rounded-lg"
                    />
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {posts[0].title}
                    </h3>
                  </div>
                </NavLink>
              )}
            </div>
            <div className="mt-2">
              {/* Right Section */}
              {posts[2] && (
                <NavLink to={`/articles/${posts[2].$id}`}>
                  <div key={posts[2].$id}>
                    <img
                      src={posts[2].imageUrl}
                      alt={posts[2].title}
                      className="w-full h-auto object-cover mb-3 rounded-lg"
                    />
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {posts[2].title}
                    </h3>
                    <p className="text-gray-600 truncate">
                      {posts[2].description}
                    </p>
                  </div>
                </NavLink>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {posts.slice(3).map((post) => (
            <NavLink to={`/articles/${post.$id}`}>
              <div key={post.$id}>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-auto object-cover mb-3 rounded-lg"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {post.title}
                </h3>
                {/* <p className="text-gray-600 text-sm line-clamp-6 ">
                  {post.description}
                </p> */}
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

export default Blog;

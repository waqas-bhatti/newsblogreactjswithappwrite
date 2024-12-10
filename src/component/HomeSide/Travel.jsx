import React, { useEffect, useState } from "react";
import appwriteService from "../../AppwriteStore/appStorageService";
import { LineWave } from "react-loader-spinner";
import { NavLink } from "react-router-dom";

function Travel() {
  const [posts, setPost] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const documents = await appwriteService.fetchDocument();

        const travelData = documents.filter(
          (doc) => doc.category && doc.category.toLowerCase() === "travel"
        );

        const fetchPost = await Promise.all(
          travelData.map(async (category) => {
            let imageUrl = "https://via.placeholder.com/150";
            try {
              if (category.featuredImage) {
                imageUrl = await appwriteService.getFilePreview(
                  category.featuredImage
                );
              }
            } catch (error) {
              console.log("Can't fetch the travel image");
            }
            return { ...category, imageUrl };
          })
        );

        fetchPost.sort(
          (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
        );

        setPost(fetchPost);
      } catch (error) {
        console.error("Failed to fetch travel Data :: appwrite", error);
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

        {/* First Two Images (Side by Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Left Image with Text */}
          {posts[0] && (
            <NavLink to={`/articles/${posts[0].$id}`}>
              <div key={posts[0].$id} className="flex flex-col">
                <div className="overflow-hidden">
                  <img
                    src={posts[0].imageUrl}
                    alt={posts[0].title}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-3xl font-semibold text-gray-800 mt-2">
                  {posts[0].title}
                </h3>
                <p className="text-gray-600 mb-4">{posts[0].description}</p>
              </div>
            </NavLink>
          )}

          {/* Right Image with Text */}
          {posts[1] && (
            <NavLink to={`/articles/${posts[1].$id}`}>
              <div key={posts[1].$id} className="flex flex-col">
                <div className="overflow-hidden">
                  <img
                    src={posts[1].imageUrl}
                    alt={posts[1].title}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-3xl font-semibold text-gray-800 mt-2">
                  {posts[1].title}
                </h3>
                <p className="text-gray-600 mb-4">{posts[1].description}</p>
              </div>
            </NavLink>
          )}
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-12">
          {posts.map((post) => {
            return (
              <NavLink to={`/articles/${post.$id}`}>
                <div key={post.$id} className="relative group overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out rounded-lg"
                  />
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Travel;

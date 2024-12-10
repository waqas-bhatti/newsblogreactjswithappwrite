import React, { useEffect, useState } from "react";
import appwriteService from "../../AppwriteStore/appStorageService";
import { LineWave } from "react-loader-spinner";
import { NavLink } from "react-router-dom";

function Sports() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const documents = await appwriteService.fetchDocument();

        const sportsData = documents.filter(
          (doc) => doc.category && doc.category.toLowerCase() === "sports"
        );

        const fetchPost = await Promise.all(
          sportsData.map(async (category) => {
            let imageUrl = "https://via.placeholder.com/150"; // Default fallback
            try {
              if (category.featuredImage) {
                imageUrl = await appwriteService.getFilePreview(
                  category.featuredImage
                );
              }
            } catch (imageError) {
              console.error("Error fetching image preview:", imageError);
            }
            return { ...category, imageUrl };
          })
        );
        fetchPost.sort(
          (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
        );
        setCategory(fetchPost);
      } catch (error) {
        console.error("Error fetching sports data from Appwrite:", error);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Image with Text */}
          {categories[0] && (
            <NavLink NavLink to={`/articles/${categories[0].$id}`}>
              <div className="flex flex-col">
                <div className="overflow-hidden">
                  <img
                    src={categories[0].imageUrl}
                    alt={categories[0].title || "Default Alt Text"}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>

                <h3 className="text-3xl font-semibold text-gray-800 mt-2">
                  {categories[0].title || "Default Title"}
                </h3>
                <p className="text-gray-600 mt-4 line-clamp-2">
                  {categories[0].description || "Default description text."}
                </p>
              </div>
            </NavLink>
          )}

          {/* Right Image with Text */}
          {categories[1] && (
            <NavLink to={`/articles/${categories[1].$id}`}>
              <div key={categories[1].$id} className="flex flex-col">
                <div className="overflow-hidden">
                  <img
                    src={categories[1].imageUrl}
                    alt={categories[1].title}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-3xl font-semibold text-gray-800 mt-2">
                  {categories[1].title}
                </h3>
                <p className="text-gray-600 mt-4 line-clamp-2">
                  {categories[1].description}
                </p>
              </div>
            </NavLink>
          )}
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-12">
          {categories.slice(2).map((category) => (
            <NavLink to={`/articles/${category.$id}`}>
              <div
                key={category.$id}
                className="relative group overflow-hidden"
              >
                <img
                  src={category.imageUrl}
                  alt={category.title || "Default Alt Text"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out rounded-lg"
                />
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sports;

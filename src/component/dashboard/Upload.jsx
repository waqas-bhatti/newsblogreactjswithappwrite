import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../../AppwriteStore/appStorageService";
import authservice from "../../AppwriteStore/auth";
import { LineWave } from "react-loader-spinner";

function Upload() {
  const post = useSelector((state) => state.post.posts);
  const [documenId, setDocumentId] = useState(post?.documenId || null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDisplayForm, setIsDisplayForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // admin persmission roles

  // useEffect(() => {
  //   const adminRoles = async () => {
  //     try {
  //       const currentUser = await authservice.getCurrentUser();
  //       if (currentUser.roles && currentUser.roles.includes("admin")) {
  //         setIsAdmin(true);
  //       } else {
  //         setIsAdmin(false);
  //       }
  //     } catch (error) {}
  //   };
  //   adminRoles();
  // }, []);

  // Handle image file change
  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  // Submit handler
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // /* Admin */
      // if (!isAdmin) {
      //   alert("You have no persmission to create a post");
      // }

      const userId = await authservice.getCurrentUser();
      if (!userId) {
        throw new Error("User is not authenticated. Please log in.");
      }

      // Combine categories into a single string if multiple checkboxes are selected
      const categoriesArray = data.category || [];
      const categoryString = Array.isArray(categoriesArray)
        ? categoriesArray.join(", ")
        : categoriesArray;

      const postData = {
        title: data.title || "",
        description: data.description || "",
        tags: data.tags || "",
        featuredImage: null || "",
        category: categoryString,
        status: "active",
        userId,
      };

      // console.log("Post data before submission:", postData);

      if (image) {
        const result = await appwriteService.createFile(image);
        postData.featuredImage = result.$id;
        console.log("Uploaded image ID:", result.$id);
      }

      if (documenId) {
        console.log("Updating existing post:", documenId);
        await appwriteService.updatePost(postData, documenId);
      } else {
        console.log("Creating new post");
        await appwriteService.createPost(postData);
      }

      reset();
      setSuccessMessage("Post uploaded successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        setLoading(false);
      }, 5000);
    } catch (error) {
      console.error("Error creating/updating post:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (post) {
      setDocumentId(post.documenId || null);
      setImage(post.featuredImage || null);
    }
  }, [post]);

  const handleDisplayForm = (e) => {
    e.preventDefault();
    setIsDisplayForm(true);
  };

  // // Redirect non-admin users
  // if (!isAdmin) {
  //   return (
  //     <div className="container mx-auto p-4">
  //       <h1 className="text-3xl font-semibold text-red-500">Access Denied</h1>
  //       <p className="mt-4 text-gray-700">
  //         You do not have the necessary permissions to access this page.
  //       </p>
  //       <button
  //         onClick={() => navigate("/dashboard")}
  //         className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
  //       >
  //         Go to Dashboard
  //       </button>
  //     </div>
  //   );
  // }
  const handleCategorySelect = (e) => {
    const checkboxes = document.querySelectorAll('input[name="category"]');
    checkboxes.forEach((checkbox) => {
      if (checkbox !== e.target) {
        checkbox.checked = false; // Uncheck all other checkboxes
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
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
      <h1 className="text-3xl font-semibold text-green-700 underline ">
        To Upload the Post
      </h1>

      {successMessage && (
        <div className="mt-4 p-4 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {isDisplayForm ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Column (Title, Description, Tags, and Checkboxes) */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-lg mt-6 font-medium mb-2"
              >
                Post Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full border border-gray-300 p-2 rounded"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <div className="text-red-500">{errors.title.message}</div>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-lg font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                className="w-full border border-gray-300 p-2 rounded"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-lg font-medium mb-2">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                className="w-full border border-gray-300 p-2 rounded"
                {...register("tags")}
                placeholder="Separate tags with commas"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-700">
                Select Category Appearance Post
              </h1>

              {/* Checkboxes for Categories */}
              {["sports", "travel", "entertainment", "business", "culture"].map(
                (category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={category}
                      name="category"
                      value={category}
                      {...register("category")}
                      onChange={handleCategorySelect} // Call the handler on change
                      className="p-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label htmlFor={category} className="text-gray-700">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right Column (Image Upload and Preview + Publish Button) */}
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-lg font-medium mb-2">
                Upload Image
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="w-full border border-gray-300 p-2 rounded"
                onChange={handleChangeImage}
              />
            </div>

            {imagePreview && (
              <div className="space-y-4">
                <div className="grid justify-center md:justify-end">
                  <h3 className="text-lg font-medium">Right Preview:</h3>
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="mt-2 w-66 h-auto max-w-[400px] border border-gray-300 rounded"
                  />
                </div>
              </div>
            )}

            {/* Publish Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <span>{documenId ? "Update Post" : "Publish"}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div>
          <button
            onClick={handleDisplayForm}
            type="submit"
            className="bg-blue-500 text-white p-3 mt-4 rounded"
          >
            Create New Post
          </button>
        </div>
      )}
    </div>
  );
}

export default Upload;

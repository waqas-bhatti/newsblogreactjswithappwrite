import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import appwriteService from "../../AppwriteStore/appStorageService";
import config from "../../config/config";
import { LineWave } from "react-loader-spinner";

function PostForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const post = location.state?.post || {};
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch the image from Appwrite and set preview
  const fetchImagePreview = async (fileId) => {
    try {
      const previewUrl = await appwriteService.getFilePreview(fileId); // Fetch file preview URL
      setImage(fileId);
      setImagePreview(previewUrl);
    } catch (error) {
      console.error("Failed to fetch image preview:", error.message);
    }
  };

  // Pre-fill form data if editing a post
  useEffect(() => {
    if (post.title) {
      setValue("title", post.title);
      setValue("description", post.description);
      setValue("tags", post.tags);
      setValue("category", post.category);
      if (post.featuredImage) {
        fetchImagePreview(post.featuredImage); // Fetch image for preview
      }
    }
  }, [post, setValue]);

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (!post.documentId) {
        console.error("No document ID provided for updating.");
        alert("An error occurred: Document ID is missing.");
        return;
      }

      // Ensure tags are a string, join them if needed, and trim excess spaces
      const tagsString = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .join(",");

      // Check if tags length exceeds 500 characters
      if (tagsString.length > 500) {
        alert("Tags exceed the maximum allowed length of 500 characters.");
        return;
      }

      let featuredImageId = post.featuredImage;

      // Upload new image if one is provided
      if (image instanceof File) {
        const uploadResponse = await appwriteService.createFile(image);
        featuredImageId = uploadResponse.$id;
      }

      const formData = {
        title: data.title,
        description: data.description,
        category: data.category,
        tags: tagsString, // Update tags as an array
        featuredImage: featuredImageId,
      };

      const response = await appwriteService.updatePost(
        config.appwriteColletionId,
        post.documentId,
        formData
      );

      setSuccessMessage("Update successfully Update");
      setTimeout(() => {
        setSuccessMessage("");
        setLoading(false);
      }, 400);
      return response;
    } catch (error) {
      console.error("Failed to submit post:", error.message);
      alert(`Failed to update post: ${error.message}. Please try again.`);
    }
  };

  return (
    <>
      <div>
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
      </div>

      {successMessage && (
        <div className="mt-4 p-4 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Left Column (Title, Description, Tags) */}
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

        {/* Right Column (Image Upload and Preview) */}
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

          {/* Display Image Preview */}
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
          {/* Submit Button (Align Right) */}
          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              className="w-24 bg-blue-500 text-white p-3 rounded"
            >
              {post.documentId ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default PostForm;

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import appwriteService from "../../AppwriteStore/appStorageService";
import config from "../../config/config";
import { LineWave } from "react-loader-spinner";
import { deletePost } from "../../ReduxStore/UserSlice";
import { useDispatch, useSelector } from "react-redux";

function TodoList() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const documents = await appwriteService.fetchDocument();

        const postWithImages = await Promise.all(
          documents.map(async (doc) => {
            let imageUrl = null;
            if (doc.featuredImage) {
              const filePreview = await appwriteService.getFilePreview(
                doc.featuredImage
              );
              imageUrl = filePreview.href;
            }
            return { ...doc, imageUrl, documentId: doc.$id }; // Add documentId from $id
          })
        );

        postWithImages.sort(
          (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
        );
        setPosts(postWithImages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemovePost = async (documentId) => {
    try {
      const response = await appwriteService.deletePost(
        config.appwriteColletionId,
        documentId
      );
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.documentId !== documentId)
      );
      dispatch(deletePost(documentId));
    } catch (error) {
      console.log("Can't be Deleted the Post :: appwrite error", error);
    }
  };

  return (
    <>
      <div>
        <h1>Total Length of Posts {posts.length}</h1>
      </div>
      <section className="bg-gray-50 py-8 antialiased dark:bg-gray-300 md:py-16 forced-color-adjust-auto">
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

        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-500 dark:text-black sm:text-2xl">
            This List of All Posts
          </h2>
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              {/* <!-- Conditional rendering of items goes here --> */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post.$id}
                    className="rounded-lg border mb-2 border-gray-200 bg-white text-black p-4 shadow-sm dark:border-gray-700 md:p-6"
                  >
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      {/* <!-- Product Image --> */}
                      <div className="shrink-0 md:order-1">
                        {post.imageUrl ? (
                          <div>
                            <img
                              className="h-20 w-20"
                              src={post.imageUrl}
                              alt={post.title}
                            />
                          </div>
                        ) : (
                          <div className="h-20 w-20 dark:hidden bg-gray-200"></div>
                        )}
                      </div>

                      {/* <!-- Quantity Control --> */}
                      <div className="flex items-center justify-between md:order-3 md:justify-end">
                        <h1 className="font-semibold text-gray-900 dark:text-black">
                          {post.category} {/* Display Category */}
                        </h1>
                        <div className="text-end md:order-4 md:w-32">
                          <NavLink to={`/articles/${post.$id}`}>
                            <p className="text-base font-bold ">View Post</p>
                          </NavLink>
                        </div>
                      </div>

                      {/* <!-- Product Title and Actions --> */}
                      <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                        <p className="text-base font-medium text-gray-900 hover:underline dark:text-black">
                          {post.title}
                        </p>

                        <div className="flex items-center gap-4">
                          <NavLink to="/dashboard/postform" state={{ post }}>
                            <button
                              type="button"
                              className="inline-flex items-center text-sm font-bold text-red-600 hover:underline dark:text-red-500 "
                            >
                              Edit
                            </button>
                          </NavLink>
                          <button
                            type="button"
                            onClick={() => handleRemovePost(post.documentId)}
                            className="inline-flex items-center text-sm font-bold text-red-600 hover:underline dark:text-red-500 "
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TodoList;

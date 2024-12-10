import React, { useEffect, useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment, FaFacebook, FaTwitter } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import appwriteService from "../../AppwriteStore/appStorageService";
import { LineWave } from "react-loader-spinner";
import { IoLogoWhatsapp } from "react-icons/io";

function BlogDetail() {
  const [commentStates, setCommentStates] = useState({});
  const [commentTexts, setCommentTexts] = useState({});
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [like, setLike] = useState({});

  const handleLike = () => {
    setLike(true);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const documents = await appwriteService.fetchDocument();
        const foundPost = documents.find((doc) => doc.$id === postId);
        const imageUrl = foundPost.featuredImage
          ? await appwriteService.getFilePreview(foundPost.featuredImage)
          : "https://via.placeholder.com/150";
        setPost({ ...foundPost, imageUrl });

        // Fetch related posts
        const related = await Promise.all(
          documents
            .filter(
              (doc) => doc.category === foundPost.category && doc.$id !== postId
            )
            .map(async (doc) => ({
              ...doc,
              imageUrl: doc.featuredImage
                ? await appwriteService.getFilePreview(doc.featuredImage)
                : "https://via.placeholder.com/150",
            }))
        );
        setRelatedPosts(related);

        // Initialize like states
        const initialLikeStates = related.reduce(
          (acc, relPost) => {
            acc[relPost.$id] = { liked: false, count: relPost.likes || 0 };
            return acc;
          },
          { [postId]: { liked: false, count: foundPost.likes || 0 } }
        );

        // Initialize comment states
        setCommentStates(
          related.reduce(
            (acc, relPost) => {
              acc[relPost.$id] = false; // Default: Comments closed
              return acc;
            },
            { [postId]: false }
          )
        );
        setLike(initialLikeStates);
        setCommentTexts({});
      } catch (error) {
        console.error("Can't fetch post details from appwrite", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // Toggle like status for a specific post
  const toggleLike = (id) => {
    setLike((prevStates) => {
      const { liked, count } = prevStates[id];
      return {
        ...prevStates,
        [id]: {
          liked: !liked,
          count: liked ? count - 1 : count + 1,
        },
      };
    });
  };

  // Toggle comment section visibility
  const toggleCommentSection = (postId) => {
    setCommentStates((prevStates) => ({
      ...prevStates,
      [postId]: !prevStates[postId],
    }));
  };

  // Handle comment text change
  const handleCommentChange = (postId, value) => {
    setCommentTexts((prevTexts) => ({
      ...prevTexts,
      [postId]: value,
    }));
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
      ) : (
        <div>
          {/* Main Post */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md mb-6">
            <div className="p-2 bg-gray-300 bg-opacity-80 mt-4">
              <h3 className="text-2xl font-semibold text-gray-800 ">
                {post.title}
              </h3>
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full rounded-lg mb-4"
              />
              <p className="text-gray-700">{post.description}</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-black bg-opacity-80 border-t rounded-b-lg">
              <button
                onClick={() => toggleLike(postId)}
                className="flex items-center space-x-2 text-blue-500"
              >
                {like[postId]?.liked ? (
                  <>
                    <AiFillLike />
                    <span>Liked</span>
                  </>
                ) : (
                  <>
                    <AiOutlineLike />
                    <span>Like</span>
                  </>
                )}
              </button>
              <span className="text-white">{like[postId]?.count} Likes</span>
              <button
                onClick={() => toggleCommentSection(postId)}
                className="flex items-center space-x-2 text-blue-500"
              >
                <FaRegComment />
                <span>Comment</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 text-blue-500"
              >
                <IoShareSocialOutline />
                <span>Share</span>
              </button>
            </div>
            {commentStates[postId] && (
              <div className="p-4 border-t bg-white bg-opacity-80 rounded-b-lg">
                <input
                  value={commentTexts[postId] || ""}
                  onChange={(e) => handleCommentChange(postId, e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg"
                  rows="4"
                  placeholder="Write your comment..."
                />
                <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                  Post Comment
                </button>
              </div>
            )}
          </div>

          {/* Related Posts */}
          {relatedPosts.map((related) => (
            <div
              key={related.$id}
              className="max-w-2xl mx-auto bg-white rounded-lg shadow-md mb-6"
            >
              <div className="p-2 bg-gray-300 bg-opacity-80 mt-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {related.title}
                </h3>
                <img
                  src={related.imageUrl}
                  alt={related.title}
                  className="w-full rounded-lg mb-4"
                />
                <p className="text-gray-700">{related.description}</p>
              </div>
              <div className="flex justify-between items-center p-4 bg-black bg-opacity-80 border-t rounded-b-lg">
                <button
                  onClick={() => toggleLike(related.$id)}
                  className="flex items-center space-x-2 text-blue-500"
                >
                  {like[related.$id]?.liked ? (
                    <>
                      <AiFillLike />
                      <span>Liked</span>
                    </>
                  ) : (
                    <>
                      <AiOutlineLike />
                      <span>Like</span>
                    </>
                  )}
                </button>
                <span className="text-white">
                  {like[related.$id]?.count} Likes
                </span>
                <button
                  onClick={() => toggleCommentSection(related.$id)}
                  className="flex items-center space-x-2 text-blue-500"
                >
                  <FaRegComment />
                  <span>Comment</span>
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 text-blue-500"
                >
                  <IoShareSocialOutline />
                  <span>Share</span>
                </button>
              </div>
              {commentStates[related.$id] && (
                <div className="p-4 border-t bg-white bg-opacity-80 rounded-b-lg">
                  <input
                    value={commentTexts[related.$id] || ""}
                    onChange={(e) =>
                      handleCommentChange(related.$id, e.target.value)
                    }
                    className="w-full p-4 border border-gray-300 rounded-lg"
                    rows="4"
                    placeholder="Write your comment..."
                  />
                  <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                    Post Comment
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Modal */}
          {isModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              onClick={() => setIsModalOpen(false)}
            >
              <div
                className="bg-white rounded-lg shadow-lg p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold">Share on Social Media</h3>
                <div className="flex flex-1 gap-4">
                  <IoLogoWhatsapp className="text-4xl text-green-800 " />
                  <FaTwitter className="text-4xl text-black " />
                  <FaFacebook className="text-4xl text-blue-800 " />
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default BlogDetail;

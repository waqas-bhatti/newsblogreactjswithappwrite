import {
  Client,
  Databases,
  Storage,
  Account,
  ID,
  Permission,
  Role,
  Query,
} from "appwrite";
import config from "../config/config";
import authservice from "./auth";

class AppwriteService {
  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectID);
    this.databases = new Databases(this.client);
    this.account = new Account(this.client);
    this.bucket = new Storage(this.client);
  }

  // admin role permission

  async isAdmin() {
    try {
      const user = await authservice.getCurrentUser();
      return user && user.roles && user.roles.includes("admin");
    } catch (error) {
      throw new Error("Check the Admin Persmission", error);
    }
  }

  /**
   * Create a new post with proper permissions.
   */
  async createPost({
    title,
    description,
    featuredImage,
    status,
    category,
    tags,
  }) {
    try {
      const isAdmin = await this.isAdmin();
      if (!isAdmin) {
        console.log("Access Denied user Admin can Create a Post");
      }

      const currentUser = await authservice.getCurrentUser(); // Fetch current user
      if (!currentUser || !currentUser.$id) {
        throw new Error("User is not authenticated.");
      }
      // console.log("Current user object:", currentUser);

      const userId = currentUser.$id; // Extract user ID
      const documentId = ID.unique();

      const response = await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteColletionId,
        documentId,
        {
          userId,
          title,
          description,
          featuredImage,
          status,
          category,
          tags,
        },
        [
          Permission.read(Role.any(userId)), // Only allow the user to read

          Permission.read(Role.team(config.appwriteTeamId)),
          Permission.update(Role.team(config.appwriteTeamId, "admin")),
          Permission.delete(Role.team(config.appwriteTeamId, "admin")),
        ]
      );

      console.log("Post created successfully:", response);
      return response;
    } catch (error) {
      console.error("Error creating a post:", error.message);
      throw new Error("Failed to create post.");
    }
  }

  /**
   * Update an existing post.
   */
  async updatePost(collectionId, documentId, postData) {
    try {
      // const currentUser = await authservice.getCurrentUser(); // Verify user authentication
      // if (!currentUser || !currentUser.$id) {
      //   throw new Error("User is not authenticated.");
      // }

      const isAdmin = await this.isAdmin();
      if (!isAdmin) {
        console.log("Access Denied, Admin can updatePost");
      }

      const response = await this.databases.updateDocument(
        config.appwriteDatabaseId,
        collectionId,
        documentId,
        postData
      );
      // console.log("Post updated successfully:", response);
      return response;
    } catch (error) {
      console.error("Failed to update post:", error.message);
      throw new Error("Post could not be updated. Please check your data.");
    }
  }

  /**
   * Delete an existing post.
   */
  async deletePost(collectionId, documentId) {
    try {
      // const currentUser = await authservice.getCurrentUser(); // Verify user authentication
      // if (!currentUser || !currentUser.$id) {
      //   throw new Error("User is not authenticated.");
      // }
      const isAdmin = await this.isAdmin();
      if (!isAdmin) {
        throw new Error("Access Denied the Admin can be delete the Post");
      }

      const response = await this.databases.deleteDocument(
        config.appwriteDatabaseId,
        collectionId,
        documentId
      );
      console.log("Post deleted successfully:", response);
      return response;
    } catch (error) {
      console.error("Failed to delete post:", error.message);
      throw new Error("Failed to delete post.");
    }
  }

  /**
   * Upload a file to Appwrite storage.
   */
  async createFile(file) {
    try {
      const response = await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
      console.log("File uploaded successfully:", response);
      return response;
    } catch (error) {
      console.error("Error uploading file:", error.message);
      throw new Error("File upload failed.");
    }
  }

  /**
   * Fetch all documents from the collection.
   */
  async fetchDocument() {
    try {
      const response = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteColletionId
      );
      return response.documents;
    } catch (error) {
      console.error("Failed to fetch documents:", error.message);
      throw new Error("Failed to fetch documents.");
    }
  }

  /**
   * Get a preview URL for a file.
   */
  async getFilePreview(fileId) {
    try {
      return this.bucket.getFilePreview(config.appwriteBucketId, fileId);
    } catch (error) {
      console.error("Failed to fetch file preview:", error.message);
      throw new Error("Failed to fetch file preview.");
    }
  }
}

const appwriteService = new AppwriteService();
export default appwriteService;

const config = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectID: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteColletionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
  appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
  appwriteTeamId: String(import.meta.env.VITE_APPWRITE_TEAM_ID),
  appwritePageViewsId: String(import.meta.env.VITE_APPWRITE_PAGE_VIEWS_ID),
};

export default config;

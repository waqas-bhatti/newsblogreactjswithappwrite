import { createSlice } from "@reduxjs/toolkit";

// Initial state with posts, authentication, and user details.
const initialState = {
  posts: [],
  isAuthenticated: false,
  user: null,
  pageViews: 0,
};

// Helper function to validate JSON.
const isValidJson = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

// Load initial authentication state from localStorage.
const localStorageState = () => {
  try {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const storedUser = localStorage.getItem("user");
    const user =
      storedUser && isValidJson(storedUser) ? JSON.parse(storedUser) : null;

    return { isAuthenticated, user };
  } catch (error) {
    console.error("Error loading state from storage:", error);
    return { isAuthenticated: false, user: null };
  }
};

// Merge localStorage state with initial state.
const storedState = localStorageState();
const mergedInitialState = {
  ...initialState,
  ...storedState,
};

const userSlice = createSlice({
  name: "userAndPosts",
  initialState: mergedInitialState,
  reducers: {
    // Reducer for adding a new post.
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },

    // Reducer for deleting a post by its ID.
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },

    // Reducer for updating a post.
    updatePost: (state, action) => {
      const { id, title, description, image } = action.payload;
      const post = state.posts.find((post) => post.id === id);
      if (post) {
        post.title = title;
        post.description = description;
        post.image = image;
      }
    },

    // Reducer for login.
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = { ...action.payload };

      // Persist state to localStorage.
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    // Reducer for logout.
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      // Clear state from localStorage.
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    },

    updatePageViews: (state, action) => {
      state.pageViews = action.payload;
    },
  },
});

export const {
  addPost,
  deletePost,
  updatePost,
  login,
  logout,
  updatePageViews,
} = userSlice.actions;

// Export the reducer to be used in the store.
export default userSlice.reducer;

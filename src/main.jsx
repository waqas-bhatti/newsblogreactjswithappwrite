import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./component/layout/Layout.jsx";
import DashBoardLayout from "./component/layout/DashBoardLayout.jsx";
import store from "./ReduxStore/store.js";

import Home from "./component/HomeSide/Home.jsx";
import About from "./component/HomeSide/About.jsx";
import Blog from "./component/HomeSide/Blog.jsx";
import Contact from "./component/HomeSide/Contact.jsx";
import DashBoard from "./component/HomeSide/DashBoard.jsx";
import Upload from "./component/dashboard/Upload.jsx";
import TodoList from "./component/dashboard/TodoList.jsx";
import DataReport from "./component/dashboard/DataReport.jsx";
import Profile from "./component/dashboard/Profile.jsx";
import { Provider } from "react-redux";
import Login from "./component/HomeSide/Login.jsx";
import SignUp from "./component/HomeSide/SignUp.jsx";
import ProtectRoute from "./component/ProtectedRoute/ProtectRoute.jsx";
import PostForm from "./component/dashboard/PostForm.jsx";
import BlogDetail from "./component/HomeSide/BlogDetail.jsx";
import Sports from "./component/HomeSide/Sports.jsx";
import Travel from "./component/HomeSide/Travel.jsx";
import ChatBot from "./component/dashboard/ChatBot.jsx";

const Authlayout = ({ children }) => {
  <div>{children}</div>;
};

// Define routes for the app
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/articles/:postId" element={<BlogDetail />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/travel" element={<Travel />} />

        <Route path="/dashboard" element={<DashBoardLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectRoute>
                <DashBoard />
              </ProtectRoute>
            }
          />
          <Route
            path="upload-file"
            element={
              <ProtectRoute>
                <Upload />
              </ProtectRoute>
            }
          />
          <Route
            path="todo-list"
            element={
              <ProtectRoute>
                <TodoList />
              </ProtectRoute>
            }
          />
          <Route
            path="postform"
            element={
              <ProtectRoute>
                <PostForm />
              </ProtectRoute>
            }
          />
          <Route
            path="chatbot"
            element={
              <ProtectRoute>
                <ChatBot />
              </ProtectRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectRoute>
                <Profile />
              </ProtectRoute>
            }
          />
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="sign-up" element={<SignUp />} />
      {/* Authentication routes */}
    </>
  )
);

// Wrap the entire app with ClerkProvider
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

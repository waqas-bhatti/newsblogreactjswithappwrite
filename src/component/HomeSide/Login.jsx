import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authservice from "../../AppwriteStore/auth";
import { login } from "../../ReduxStore/UserSlice";
import { Oval } from "react-loader-spinner";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const validate = (data) => {
    const { email, password } = data;
    const errors = {};

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email";
    }

    if (!password || password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    return errors;
  };

  const onsubmit = async (data) => {
    const { email, password } = data;

    try {
      // Ensure there is no active session
      try {
        setLoading(true);
        const currentUser = await authservice.getCurrentUser();
        if (currentUser) await authservice.logout();
      } catch (e) {
        console.log("No active session to log out from.");
      }

      // Create a new session
      const session = await authservice.login({ email, password });

      if (session) {
        // Fetch the logged-in user's information
        const userData = await authservice.getCurrentUser();
        if (userData) {
          dispatch(login({ user: { ...userData } }));
          setTimeout(() => {
            setLoading(false);
            navigate("/");
            console.log("Login successful");
          }, 300);
        }
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await authservice.googleAuth();
      setTimeout(() => {
        setLoading(false);
      }, 500);
      navigate("/");
    } catch (error) {
      console.log("Failed To login :: appwrite", error);
    }
  };

  return (
    <>
      <section className="bg-gray-200 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          {/* Left side */}
          <NavLink
            to="/"
            className="flex justify-center items-center mb-6 md:mb-0 "
          >
            <img
              src="https://png.pngtree.com/png-vector/20230304/ourmid/pngtree-colorful-blog-speech-bubble-vector-png-image_6633021.png"
              alt="Logo"
              className="w-32 h-32 md:w-96 md:h-96"
            />
          </NavLink>

          {/* Right side */}
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              {/* OR text with lines on both sides */}

              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mt-6">
                Sign in to your account
              </h1>
              <form
                className="space-y-4 md:space-y-2"
                onSubmit={handleSubmit(onsubmit)}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <div className="text-red-800">{errors.email.message}</div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && <div>{errors.password.message}</div>}
                </div>
                {loading ? (
                  <>
                    <Oval
                      visible={true}
                      height="18" // Adjust the size to match the button size
                      width="18"
                      color="#FF0000"
                      ariaLabel="line-wave-loading"
                      wrapperClass="flex justify-center items-center"
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <button
                        type="submit"
                        className="w-full flex items-center mt-3 justify-center py-2 px-4 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-red-500 hover:bg-red-700"
                      >
                        Sign in
                      </button>
                      {/* Sign In Link */}
                      <p className="text-sm font-light mt-3 text-black dark:text-gray-400">
                        Create have an account?{" "}
                        <NavLink
                          to="/sign-up"
                          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                          Sign up
                        </NavLink>
                      </p>
                    </div>
                    <div className="flex items-center justify-center my-4">
                      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                      <span className="mx-4 text-gray-500 dark:text-gray-400">
                        or
                      </span>
                      <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="flex flex-col items-center space-y-4 mt-6">
                      <button
                        onClick={handleGoogleLogin}
                        className=" w-full flex items-center p-2 bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <svg
                          className="h-6 w-6 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          width="800px"
                          height="800px"
                          viewBox="-0.5 0 48 48"
                        >
                          <title>Google-color</title>
                          <g id="Icons" fill="none" fillRule="evenodd">
                            <g id="Google">
                              <path
                                d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                                fill="#FBBC05"
                              />
                              <path
                                d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                                fill="#EB4335"
                              />
                              <path
                                d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                                fill="#34A853"
                              />
                              <path
                                d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                                fill="#4285F4"
                              />
                            </g>
                          </g>
                        </svg>
                        <span>Continue with Google</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;

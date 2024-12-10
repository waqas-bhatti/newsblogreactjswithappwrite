import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About Us</h1>
        <p className="text-xl text-gray-700 mb-8">
          Welcome to the News Hub! We are a dedicated team bringing you the
          latest and most relevant news from around the world. Whether it's
          breaking news, in-depth analysis, or trending topics, we've got you
          covered.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto text-center py-12 px-6 bg-white shadow-lg rounded-lg mb-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Our Mission
        </h2>
        <p className="text-lg text-gray-600">
          Our mission is to deliver timely, reliable, and unbiased news to our
          readers. We aim to keep the world informed, engaged, and empowered
          with well-researched articles and insightful perspectives.
        </p>
      </div>
    </div>
  );
};

export default About;

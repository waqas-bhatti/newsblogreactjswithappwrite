import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (you can replace this with an actual API call)
    setTimeout(() => {
      alert("Form submitted successfully!");
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    }, 2000);
  };

  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          Contact Us
        </h1>
        <p className="text-lg text-gray-700 mb-12">
          We’d love to hear from you! Please fill out the form below and we will
          get back to you as soon as possible.
        </p>
      </div>

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-6">
            <div className="w-full">
              <label
                htmlFor="name"
                className="block text-gray-700 font-semibold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-gray-700 font-semibold mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              required
              className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 text-white bg-blue-600 rounded-md ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Company Info */}
      <div className="max-w-6xl mx-auto text-center mt-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Our Contact Information
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Feel free to reach out to us using the contact information below:
        </p>
        <div className="space-y-4">
          <div className="text-gray-700">
            <strong>📧 Email:</strong> support@newswebsite.com
          </div>
          <div className="text-gray-700">
            <strong>📞 Phone:</strong> +1 (123) 456-7890
          </div>
          <div className="text-gray-700">
            <strong>📍 Address:</strong> 123 News Street, City, State, 12345
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

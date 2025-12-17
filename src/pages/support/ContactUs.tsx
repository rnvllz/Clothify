import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div className="bg-white border border-gray-100 p-8">
      <img
        src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
        alt="Contact us"
        className="w-full h-48 object-cover mb-6"
      />
      <h1 className="text-3xl font-light text-black mb-6 tracking-wide">Contact Us</h1>
      <div className="space-y-4 text-gray-700 font-light">
        <p>
          Have a question or need assistance? Our customer service team is here to help.
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href="mailto:support@clothify.com" className="text-black hover:underline">
            support@clothify.com
          </a>
        </p>
        <p>
          <strong>Phone:</strong> 1-800-CLOTHIFY
        </p>
        <p>
          Our support hours are Monday to Friday, 9 AM to 5 PM EST.
        </p>
      </div>
    </div>
  );
};

export default ContactUs;

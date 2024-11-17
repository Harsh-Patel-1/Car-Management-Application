import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-semibold">
        <h1>
          <Link to="/cars">Cars</Link>
        </h1>
      </div>
      <ul className="flex space-x-6">
        <li>
          <Link
            to="/login"
            className="hover:bg-gray-600 px-4 py-2 rounded-md transition duration-200"
          >
            Login
          </Link>
        </li>
        <li>
          <Link
            to="/register"
            className="hover:bg-gray-600 px-4 py-2 rounded-md transition duration-200"
          >
            Register
          </Link>
        </li>
        <li>
          <Link
            to="/cars"
            className="hover:bg-gray-600 px-4 py-2 rounded-md transition duration-200"
          >
            Cars
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

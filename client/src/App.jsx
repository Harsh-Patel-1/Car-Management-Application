import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Car from "./pages/car/Car";
import CarDetails from "./pages/car-details/CarDetails";
import Navbar from "./components/NavBar";
function App() {
  return (
    <main>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<Car />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </main>
  );
}

export default App;

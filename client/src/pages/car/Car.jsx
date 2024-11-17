import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { axiosInstance } from "../../utils/axiosService";

function Car() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [newCar, setNewCar] = useState({
    title: "",
    description: "",
    tags: [],
    images: [],
  });
  const [editCar, setEditCar] = useState({
    title: "",
    description: "",
    tags: [],
    images: [],
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axiosInstance.get("/api/cars");
        setCars(response.data);
        setLoading(false);
      } catch (error) {
        setErrorMessage("Error fetching cars");
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleAddCar = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/api/cars", newCar); // Make the POST request
      const addedCar = response.data; // Assuming the backend returns the car with _id
      setCars([...cars, addedCar]); // Add the car to the state with _id
      setIsAddModalOpen(false);
      setNewCar({ title: "", description: "", tags: [], images: [] });
    } catch (error) {
      setErrorMessage("Error adding car");
    }
  };

  const handleEditCar = (car) => {
    setEditCar({ ...car });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.put(`/api/cars/${editCar._id}`, editCar);
      setCars(cars.map((car) => (car._id === editCar._id ? editCar : car)));
      setIsEditModalOpen(false);
    } catch (error) {
      setErrorMessage("Error updating car");
    }
  };

  const handleDeleteCar = async (id) => {
    try {
      await axiosInstance.delete(`/api/cars/${id}`);
      setCars(cars.filter((car) => car._id !== id));
    } catch (error) {
      setErrorMessage("Error deleting car");
    }
  };

  const handleChange = (e, type) => {
    const { name, value } = e.target;

    if (type === "add") {
      if (name === "tags" || name === "images") {
        const newValue = value.split(",").map((item) => item.trim());
        setNewCar({ ...newCar, [name]: newValue });
      } else {
        setNewCar({ ...newCar, [name]: value });
      }
    } else {
      if (name === "tags" || name === "images") {
        const newValue = value.split(",").map((item) => item.trim());
        setEditCar({ ...editCar, [name]: newValue });
      } else {
        setEditCar({ ...editCar, [name]: value });
      }
    }
  };

  const handleRowClick = (carId) => {
    // Redirect to the details page for the selected car
    navigate(`/car-details/${carId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 my-4">
        Cars Management
      </h1>

      {errorMessage && (
        <div className="bg-red-500 text-white p-4 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="bg-blue-600 text-white p-2 rounded mb-4"
      >
        Add New Car
      </button>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Car Name</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Tags</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr
                  key={car._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(car._id)} // Make row clickable
                >
                  <td className="px-6 py-4">{car.title}</td>
                  <td className="px-6 py-4">{car.description}</td>
                  <td className="px-6 py-4">{car.tags.join(", ")}</td>
                  <td className="px-6 py-4 space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCar(car);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCar(car._id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Car Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Car</h2>
            <form onSubmit={handleAddCar}>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Car Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newCar.title}
                  onChange={(e) => handleChange(e, "add")}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newCar.description}
                  onChange={(e) => handleChange(e, "add")}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={newCar.tags.join(", ")} // Join array into comma-separated string
                  onChange={(e) => handleChange(e, "add")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700"
                >
                  Images (URLs)
                </label>
                <input
                  type="text"
                  id="images"
                  name="images"
                  value={newCar.images.join(", ")} // Join array into comma-separated string
                  onChange={(e) => handleChange(e, "add")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mt-4 text-right">
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Add Car
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded ml-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Car</h2>
            <form onSubmit={handleSaveEdit}>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Car Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editCar.title}
                  onChange={(e) => handleChange(e, "edit")}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editCar.description}
                  onChange={(e) => handleChange(e, "edit")}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={editCar.tags.join(", ")} // Join array into comma-separated string
                  onChange={(e) => handleChange(e, "edit")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700"
                >
                  Images (URLs)
                </label>
                <input
                  type="text"
                  id="images"
                  name="images"
                  value={editCar.images.join(", ")} // Join array into comma-separated string
                  onChange={(e) => handleChange(e, "edit")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mt-4 text-right">
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded ml-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Car;

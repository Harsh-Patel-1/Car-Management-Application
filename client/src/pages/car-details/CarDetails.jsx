import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosService";

function CarDetails() {
  const { id } = useParams(); // Get the car id from the URL
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/cars/${id}`);
        setCar(response.data);
        setLoading(false);
      } catch (error) {
        setErrorMessage("Error fetching car details");
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]); // Fetch car details when the id changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return (
      <div className="bg-red-500 text-white p-4 rounded mb-4">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 my-4">{car.title}</h1>
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Car Details</h2>
        <div>
          <p>
            <strong>Description:</strong> {car.description}
          </p>
          <p>
            <strong>Tags:</strong> {car.tags.join(", ")}
          </p>
          <p>
            <strong>Images:</strong>
          </p>
          <div className="grid grid-cols-3 gap-4">
            {car.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Car Image ${index + 1}`}
                className="w-full h-40 object-cover rounded"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarDetails;

const Car = require("../carModel/carModel");

// Add a new car
exports.addCar = async (req, res) => {
  try {
    const { title, description, tags, images } = req.body;

    if (images.length > 10) {
      return res
        .status(400)
        .json({ message: "You can only upload up to 10 images." });
    }

    const newCar = await Car.create({ title, description, tags, images });
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search cars globally
exports.searchCars = async (req, res) => {
  try {
    const { keyword } = req.query;
    const cars = await Car.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ],
    });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get car details
exports.getCarDetails = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a car
exports.updateCar = async (req, res) => {
  try {
    const { title, description, tags, images } = req.body;
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { title, description, tags, images },
      { new: true }
    );
    if (!updatedCar) return res.status(404).json({ message: "Car not found" });
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a car
exports.deleteCar = async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) return res.status(404).json({ message: "Car not found" });
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

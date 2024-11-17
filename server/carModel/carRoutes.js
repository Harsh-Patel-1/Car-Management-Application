const express = require("express");
const carController = require("../carModel/carController");
const router = express.Router();

router.post("/cars", carController.addCar);
router.get("/cars", carController.getAllCars);
router.get("/cars/search", carController.searchCars);
router.get("/cars/:id", carController.getCarDetails);
router.put("/cars/:id", carController.updateCar);
router.delete("/cars/:id", carController.deleteCar);

module.exports = router;

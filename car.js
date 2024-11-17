require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const carRoutes = require("./carModel/carRoutes");

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/api", carRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

// Environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/crudapi";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Middleware for verifying JWT
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Routes
// 1. Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password)
    return res.status(400).json({ message: "All fields are required" });

  // Check if user already exists
  const userExists = await User.findOne({ username });
  if (userExists)
    return res.status(400).json({ message: "Username already exists" });

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save new user
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: "User registered successfully" });
});

// 2. Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password)
    return res.status(400).json({ message: "All fields are required" });

  // Find the user
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Generate JWT
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({ token });
});

// CRUD Routes (protected)
// 3. Create
app.post("/items", authenticateToken, async (req, res) => {
  const { name, description } = req.body;
  // Add validation
  const newItem = { name, description, userId: req.user.id };
  res.status(201).json({ message: "Item created", newItem });
});

// 4. Read
app.get("/items", authenticateToken, async (req, res) => {
  res.status(200).json({ message: "Items retrieved" });
});

// 5. Update
app.put("/items/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  res.status(200).json({ message: `Item ${id} updated`, name, description });
});

// 6. Delete
app.delete("/items/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  res.status(200).json({ message: `Item ${id} deleted` });
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

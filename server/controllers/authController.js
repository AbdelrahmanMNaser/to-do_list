const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
    
  });
};

const isExistingUser = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user ? true : false; // Return true if user exists
  } catch (error) {
    console.error("Error checking existing user:", error);
    throw new Error("Database error"); // Throw an error if database operation fails
  }
};

// Register a new user
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {

    // Check if user already exists
    if (await isExistingUser(email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ username, password, email });
    await newUser.save();


    // Generate a token for the user
    const token = generateToken(newUser._id);

    // Send response with user details and token
    res.status(201).json({
      message: "User registered successfully",
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a token for the user
    const token = generateToken(user._id);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };

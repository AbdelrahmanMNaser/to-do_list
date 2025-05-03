const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Exclude password from queries by default
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Only hash if password is modified
  }

  const salt = await bcrypt.genSalt(10); // Generate a salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

module.exports = mongoose.model("User", userSchema);

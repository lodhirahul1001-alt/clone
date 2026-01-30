// Run: node src/scripts/createAdmin.js
// Env required: MONGO_URI, JWT_SECRET

require("dotenv").config();
const connectDb = require("../db/db");
const userModel = require("../models/user.model");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "Fastadmin@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Rahul@787878";
const ADMIN_NAME = process.env.ADMIN_NAME || "Fast Admin";

(async () => {
  try {
    await connectDb();

    const email = String(ADMIN_EMAIL).trim().toLowerCase();

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        password: ADMIN_PASSWORD,
        fullName: ADMIN_NAME,
        role: "admin",
      });

      console.log("✅ Admin user created:", email);
    } else {
      // upgrade existing user to admin
      user.role = "admin";
      if (process.env.RESET_ADMIN_PASSWORD === "true") {
        user.password = ADMIN_PASSWORD; // will hash via pre-save
      }
      await user.save();
      console.log("✅ Admin user updated:", email);
    }

    process.exit(0);
  } catch (e) {
    console.error("❌ Failed to create admin:", e);
    process.exit(1);
  }
})();

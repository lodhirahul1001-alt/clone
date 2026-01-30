// server.js or app.js
require("dotenv").config(); // ✅ Load .env variables

const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");

// ✅ Import routes
const AuthRoute = require("./routes/auth.routes");
const PostRoute = require("./routes/post.route");
const UserRoute = require("./routes/user.route");
const ChatRoute = require("./routes/chat.routes");
const TrackRoute = require("./routes/track.routes");
const SubLabelRoute = require("./routes/sublabel.routes");
const AdminRoute = require("./routes/admin.routes");
const PaymentRoute = require("./routes/payment.routes");

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://clone-orpin-three.vercel.app",
  "https://clone-pwmi24psg-fast-releases-projects.vercel.app",
  "https://prdigitalcm.in",
  "https://www.prdigitalcm.in",
];

// ✅ CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // null origin = Postman / server-to-server requests
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Apply CORS globally
app.use(cors(corsOptions));

// ✅ Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ensure upload folders exist
try {
  fs.mkdirSync(path.join(process.cwd(), "uploads", "payments"), { recursive: true });
} catch (e) {
  console.warn("Could not create uploads folder", e);
}

// ✅ Serve uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ API Routes
app.use("/api/auth", AuthRoute);
app.use("/api/post", PostRoute);
app.use("/api/user", UserRoute);
app.use("/api/chats", ChatRoute);
app.use("/api/tracks", TrackRoute);
app.use("/api/sublabels", SubLabelRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/payments", PaymentRoute);

// ✅ Root route (optional)
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;

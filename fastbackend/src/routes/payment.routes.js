const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Store uploaded screenshots in /uploads/payments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads", "payments"));
  },
  filename: (req, file, cb) => {
    const safe = (file.originalname || "screenshot").replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/verify", upload.single("screenshot"), async (req, res) => {
  try {
    const { fullName, email, phone, transactionId, plan, billing, amount } = req.body;
    if (!fullName || !email || !phone || !transactionId || !plan || !amount) {
      return res.status(422).json({ msg: "Missing required fields" });
    }

    // For now we just store the file and return success.
    // You can later save this in DB or send an email to admin.
    return res.status(200).json({
      msg: "Verification submitted",
      data: {
        fullName,
        email,
        phone,
        transactionId,
        plan,
        billing,
        amount,
        screenshot: req.file ? `/uploads/payments/${req.file.filename}` : null,
      },
    });
  } catch (error) {
    console.error("payment verify error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;

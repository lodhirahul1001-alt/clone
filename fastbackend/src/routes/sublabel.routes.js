const express = require("express");
const authMiddleware = require("../middlwares/auth.middleware");
const {
  createSubLabel,
  deleteSubLabel,
  getMySubLabels,
  updateSubLabel,
} = require("../controllers/sublabel.controller");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMySubLabels);
router.post("/", createSubLabel);
router.put("/:id", updateSubLabel);
router.delete("/:id", deleteSubLabel);

module.exports = router;

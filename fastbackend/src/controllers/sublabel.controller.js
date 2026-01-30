const { SubLabel } = require("../models/sublabel.model");

// Simple ownership based CRUD for Sub-Labels

exports.createSubLabel = async (req, res) => {
  try {
    const { name, email, phone, website, city, state } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const doc = await SubLabel.create({
      owner: req.user._id,
      name,
      email,
      phone,
      website,
      city,
      state,
    });

    return res.status(201).json({ message: "Sub-label created", data: doc });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getMySubLabels = async (req, res) => {
  try {
    const list = await SubLabel.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return res.json({ data: list });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateSubLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await SubLabel.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Sub-label not found" });
    return res.json({ message: "Updated", data: updated });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteSubLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SubLabel.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Sub-label not found" });
    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

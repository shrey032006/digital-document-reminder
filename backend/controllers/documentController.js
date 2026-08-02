const Document = require("../models/Document");

exports.createDocument = async (req, res) => {
  try {
    const { documentName, documentNumber, category, issueDate, expiryDate, notes } = req.body;

    if (!documentName || !expiryDate) {
      return res.status(400).json({ message: "Document name and expiry date are required." });
    }

    const doc = await Document.create({
      user: req.userId,
      documentName,
      documentNumber,
      category,
      issueDate: issueDate || undefined,
      expiryDate,
      notes,
      filePath: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({ document: doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to create document.", error: err.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const { search, status, sort } = req.query;
    const query = { user: req.userId };

    if (search) {
      query.documentName = { $regex: search, $options: "i" };
    }

    let docs = await Document.find(query);

    // Serialize (adds virtual status/daysLeft)
    docs = docs.map((d) => d.toJSON());

    if (status && status !== "all") {
      docs = docs.filter((d) => d.status === status);
    }

    docs.sort((a, b) => {
      if (sort === "name") return a.documentName.localeCompare(b.documentName);
      return new Date(a.expiryDate) - new Date(b.expiryDate); // default: soonest expiry first
    });

    const summary = {
      total: docs.length,
      expired: docs.filter((d) => d.status === "expired").length,
      urgent: docs.filter((d) => d.status === "urgent").length,
      soon: docs.filter((d) => d.status === "soon").length,
      valid: docs.filter((d) => d.status === "valid").length,
    };

    res.json({ documents: docs, summary });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch documents.", error: err.message });
  }
};

exports.getDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, user: req.userId });
    if (!doc) return res.status(404).json({ message: "Document not found." });
    res.json({ document: doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch document.", error: err.message });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, user: req.userId });
    if (!doc) return res.status(404).json({ message: "Document not found." });

    const { documentName, documentNumber, category, issueDate, expiryDate, notes } = req.body;

    if (documentName) doc.documentName = documentName;
    if (documentNumber !== undefined) doc.documentNumber = documentNumber;
    if (category) doc.category = category;
    if (issueDate) doc.issueDate = issueDate;
    if (expiryDate) doc.expiryDate = expiryDate;
    if (notes !== undefined) doc.notes = notes;
    if (req.file) doc.filePath = `/uploads/${req.file.filename}`;

    await doc.save();
    res.json({ document: doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to update document.", error: err.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!doc) return res.status(404).json({ message: "Document not found." });
    res.json({ message: "Document deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete document.", error: err.message });
  }
};

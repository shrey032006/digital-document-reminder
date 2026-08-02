const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController");

router.use(auth);

router.get("/", getDocuments);
router.post("/", upload.single("file"), createDocument);
router.get("/:id", getDocument);
router.put("/:id", upload.single("file"), updateDocument);
router.delete("/:id", deleteDocument);

module.exports = router;

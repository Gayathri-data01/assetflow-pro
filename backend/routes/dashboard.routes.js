const express = require("express");

const router = express.Router();

const {
  getSummary,
} = require("../controllers/dashboard.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get(
  "/summary",
  authMiddleware,
  getSummary
);

module.exports = router;
const express = require("express");

const router = express.Router();

const {
  createRequest,
  getRequests,
  updateRequest,
  getHistory,
  getNotifications,
  addComment,
  getComments,
  editRequest,
} = require("../controllers/asset.controller");

const authMiddleware = require("../middleware/auth.middleware");

// CREATE REQUEST
router.post(
  "/requests",
  authMiddleware,
  createRequest
);

// GET REQUESTS
router.get(
  "/requests",
  authMiddleware,
  getRequests
);

// UPDATE STATUS
router.put(
  "/requests/:id",
  authMiddleware,
  updateRequest
);

// EDIT REQUEST
router.put(
  "/requests/edit/:id",
  authMiddleware,
  editRequest
);

// GET HISTORY
router.get(
  "/requests/:id/history",
  authMiddleware,
  getHistory
);

// GET NOTIFICATIONS
router.get(
  "/notifications",
  authMiddleware,
  getNotifications
);

// ADD COMMENT
router.post(
  "/requests/:id/comments",
  authMiddleware,
  addComment
);

// GET COMMENTS
router.get(
  "/requests/:id/comments",
  authMiddleware,
  getComments
);

module.exports = router;
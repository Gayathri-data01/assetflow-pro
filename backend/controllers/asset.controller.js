const db = require("../config/db");

// CREATE REQUEST
exports.createRequest = (req, res) => {

  const {
    asset_type,
    asset_name,
    reason,
    duration,
    department,
    issue_date,
    attachment,
  } = req.body;

  const userId = req.user.id;

  // VALIDATION
  if (
    !asset_type ||
    !asset_name ||
    !reason ||
    !duration ||
    !department ||
    !issue_date
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  db.run(
    `
    INSERT INTO asset_requests
    (
      user_id,
      asset_type,
      asset_name,
      reason,
      duration,
      department,
      issue_date,
      attachment,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      asset_type,
      asset_name,
      reason,
      duration,
      department,
      issue_date,
      attachment,
      "Requested",
    ],
    function (err) {

      if (err) {
        return res.status(500).json(err);
      }

      const requestId = this.lastID;

      // HISTORY
      db.run(
        `
        INSERT INTO asset_history
        (request_id, action)
        VALUES (?, ?)
        `,
        [requestId, "Requested"]
      );

      res.status(201).json({
        message: "Request Created Successfully",
      });
    }
  );
};

// GET REQUESTS
exports.getRequests = (req, res) => {

  const {
    asset_type,
    department,
    status,
    employee_name,
  } = req.query;

  let query = `
    SELECT
      asset_requests.*,
      users.name AS employee_name
    FROM asset_requests
    JOIN users
    ON asset_requests.user_id = users.id
    WHERE 1=1
  `;

  const params = [];

  // FILTER BY ASSET TYPE
  if (asset_type) {

    query += `
      AND asset_requests.asset_type
      LIKE ?
    `;

    params.push(`%${asset_type}%`);
  }

  // FILTER BY DEPARTMENT
  if (department) {

    query += `
      AND asset_requests.department
      LIKE ?
    `;

    params.push(`%${department}%`);
  }

  // FILTER BY STATUS
  if (status) {

    query += `
      AND asset_requests.status
      LIKE ?
    `;

    params.push(`%${status}%`);
  }

  // FILTER BY EMPLOYEE NAME
  if (employee_name) {

    query += `
      AND users.name
      LIKE ?
    `;

    params.push(`%${employee_name}%`);
  }

  query += `
    ORDER BY asset_requests.id DESC
  `;

  db.all(
    query,
    params,
    (err, rows) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json(rows);
    }
  );
};

// UPDATE STATUS
exports.updateRequest = (req, res) => {

  const { status } = req.body;

  const id = req.params.id;

  db.get(
    `
    SELECT *
    FROM asset_requests
    WHERE id = ?
    `,
    [id],
    (err, request) => {

      if (err) {
        return res.status(500).json(err);
      }

      db.run(
        `
        UPDATE asset_requests
        SET status = ?
        WHERE id = ?
        `,
        [status, id],
        function (err) {

          if (err) {
            return res.status(500).json(err);
          }

          // HISTORY
          db.run(
            `
            INSERT INTO asset_history
            (request_id, action)
            VALUES (?, ?)
            `,
            [id, status]
          );

          // NOTIFICATION
          db.run(
            `
            INSERT INTO notifications
            (user_id, message)
            VALUES (?, ?)
            `,
            [
              request.user_id,
              `Your asset request for ${request.asset_name} was ${status}`,
            ]
          );

          res.status(200).json({
            message: "Status Updated",
          });
        }
      );
    }
  );
};

// GET HISTORY
exports.getHistory = (req, res) => {

  const requestId = req.params.id;

  db.all(
    `
    SELECT *
    FROM asset_history
    WHERE request_id = ?
    ORDER BY created_at DESC
    `,
    [requestId],
    (err, rows) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json(rows);
    }
  );
};

// GET NOTIFICATIONS
exports.getNotifications = (req, res) => {

  const userId = req.user.id;

  db.all(
    `
    SELECT *
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId],
    (err, rows) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json(rows);
    }
  );
};

// ADD COMMENT
exports.addComment = (req, res) => {

  const requestId = req.params.id;

  const { comment } = req.body;

  const managerId = req.user.id;

  if (!comment) {
    return res.status(400).json({
      message: "Comment is required",
    });
  }

  db.run(
    `
    INSERT INTO review_comments
    (
      request_id,
      manager_id,
      comment
    )
    VALUES (?, ?, ?)
    `,
    [
      requestId,
      managerId,
      comment,
    ],
    function (err) {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Comment Added Successfully",
      });
    }
  );
};

// GET COMMENTS
exports.getComments = (req, res) => {

  const requestId = req.params.id;

  db.all(
    `
    SELECT
      review_comments.*,
      users.name AS manager_name
    FROM review_comments
    JOIN users
    ON review_comments.manager_id = users.id
    WHERE request_id = ?
    ORDER BY created_at DESC
    `,
    [requestId],
    (err, rows) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json(rows);
    }
  );
};

// EDIT REQUEST
exports.editRequest = (req, res) => {

  const id = req.params.id;

  const {
    asset_type,
    asset_name,
    reason,
    duration,
    department,
    issue_date,
    attachment,
  } = req.body;

  db.get(
    `
    SELECT *
    FROM asset_requests
    WHERE id = ?
    `,
    [id],
    (err, request) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (!request) {
        return res.status(404).json({
          message: "Request not found",
        });
      }

      // RESTRICT EDIT
      if (request.status !== "Requested") {

        return res.status(400).json({
          message:
            "Cannot edit after approval process started",
        });
      }

      db.run(
        `
        UPDATE asset_requests
        SET
          asset_type = ?,
          asset_name = ?,
          reason = ?,
          duration = ?,
          department = ?,
          issue_date = ?,
          attachment = ?
        WHERE id = ?
        `,
        [
          asset_type,
          asset_name,
          reason,
          duration,
          department,
          issue_date,
          attachment,
          id,
        ],
        function (err) {

          if (err) {
            return res.status(500).json(err);
          }

          // HISTORY
          db.run(
            `
            INSERT INTO asset_history
            (request_id, action)
            VALUES (?, ?)
            `,
            [id, "Request Edited"]
          );

          res.status(200).json({
            message: "Request Updated Successfully",
          });
        }
      );
    }
  );
};
const db = require("../config/db");

exports.getSummary = (req, res) => {

  const summary = {};

  // TOTAL REQUESTS
  db.get(
    `
    SELECT COUNT(*) AS total
    FROM asset_requests
    `,
    [],
    (err, totalResult) => {

      if (err) {
        return res.status(500).json(err);
      }

      summary.totalRequests =
        totalResult.total;

      // APPROVED
      db.get(
        `
        SELECT COUNT(*) AS approved
        FROM asset_requests
        WHERE status = 'Approved'
        `,
        [],
        (err, approvedResult) => {

          if (err) {
            return res.status(500).json(err);
          }

          summary.approvedRequests =
            approvedResult.approved;

          // RETURNED
          db.get(
            `
            SELECT COUNT(*) AS returned
            FROM asset_requests
            WHERE status = 'Returned'
            `,
            [],
            (err, returnedResult) => {

              if (err) {
                return res.status(500).json(err);
              }

              summary.returnedAssets =
                returnedResult.returned;

              // PENDING
              db.get(
                `
                SELECT COUNT(*) AS pending
                FROM asset_requests
                WHERE status = 'Requested'
                `,
                [],
                (err, pendingResult) => {

                  if (err) {
                    return res.status(500).json(err);
                  }

                  summary.pendingApprovals =
                    pendingResult.pending;

                  // DEPARTMENT STATS
                  db.all(
                    `
                    SELECT
                      department,
                      COUNT(*) AS count
                    FROM asset_requests
                    GROUP BY department
                    `,
                    [],
                    (err, deptResult) => {

                      if (err) {
                        return res.status(500).json(err);
                      }

                      summary.departmentStats =
                        deptResult;

                      res.status(200).json(summary);
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};
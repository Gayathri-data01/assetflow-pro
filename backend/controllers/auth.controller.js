const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  const { name, email, password, role, department } = req.body;

  if (!name || !email || !password || !role || !department) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {

    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {

        if (user) {
          return res.status(400).json({
            message: "User already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
          `INSERT INTO users 
          (name, email, password, role, department)
          VALUES (?, ?, ?, ?, ?)`,
          [name, email, hashedPassword, role, department],
          function (err) {

            if (err) {
              return res.status(500).json(err);
            }

            res.status(201).json({
              message: "Registration successful",
            });
          }
        );
      }
    );

  } catch (error) {
    res.status(500).json(error);
  }
};

// LOGIN
exports.login = (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, user) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        "secretkey",
        {
          expiresIn: "1d",
        }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
};
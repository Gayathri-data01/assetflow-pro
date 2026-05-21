const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const assetRoutes = require("./routes/asset.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

// DB CONNECTION
require("./config/db");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/dashboard", dashboardRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("AssetFlow Pro Backend Running");
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
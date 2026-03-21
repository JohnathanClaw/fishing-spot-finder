const express = require("express");
const cors = require("cors");
require("dotenv/config");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp
  .prepare()
  .then(() => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    try {
      app.use("/api/users", require("./routes/users"));
    } catch (err) {
      console.error("Failed to mount /api/users:", err);
    }

    try {
      app.use("/api/fishing_spots", require("./routes/fishing_spots"));
    } catch (err) {
      console.error("Failed to mount /api/fishing_spots:", err);
    }

    try {
      app.use("/api/spot_reviews", require("./routes/spot_reviews"));
    } catch (err) {
      console.error("Failed to mount /api/spot_reviews:", err);
    }

    try {
      app.use("/api/user_settings", require("./routes/user_settings"));
    } catch (err) {
      console.error("Failed to mount /api/user_settings:", err);
    }

    app.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });

    app.all("*", (req, res) => handle(req, res));

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });

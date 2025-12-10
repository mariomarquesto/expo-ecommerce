import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./config/env.js";

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

// producción
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../admin/dist")));

  app.use((req, res) => {
    res.sendFile(
      path.join(__dirname, "../../admin/dist/index.html")
    );
  });
}

app.listen(ENV.PORT, () => {
  console.log(`✅ Server running on http://localhost:${ENV.PORT}`);
});

import { Router } from "express";
const router = Router();

router.get("/health", (_, res) => {
  res.status(200).json({ message: "Success" });
});

export default router;

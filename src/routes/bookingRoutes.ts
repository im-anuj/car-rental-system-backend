import express from "express";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.get('/', authMiddleware, async (req, res) =>{
  res.json({
    message: "Checking"
  });
});

export default router;
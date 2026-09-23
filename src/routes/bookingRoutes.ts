import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { validate } from "../middleware/validator";
import { bookingSchema } from "../schemas/bookingSchema";
import type { bookingInput } from "../schemas/bookingSchema";
import pool from "../config/database";
import type { Request } from "express";

const router = express.Router();

router.use(authMiddleware, validate(bookingSchema));

router.post('/', async (req: Request<{}, {}, bookingInput>, res) => {
  const userId = req.user.userId;
  const { carName, days, rentPerDay } = req.body;
  const totalCost = days * rentPerDay;
  const status = "booked";

  const response = await pool.query(
    `INSERT INTO bookings 
    (user_id, car_name, days, rent_per_day, status) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING id`,
    [userId, carName, days, rentPerDay, status]
  );

  res.status(201).json({
    success: true,
    data: {
      message: "Booking created successfully",
      bookingId: response.rows[0].id,
      totalCost
    }
  });

});

router.get('/', authMiddleware, async (req, res) => {
  res.json({
    message: "Checking",
    id: req.user.userId,
    username: req.user.username
  });
});

export default router;
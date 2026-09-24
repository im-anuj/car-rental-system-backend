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

router.get('/', async (req, res) => {

  const { userId, username } = req.user;
  const { bookingId, summary } = req.query;

  if (summary === 'true') {

    const result = await pool.query(`SELECT COUNT(*) AS "totalBookings",
      COALESCE(SUM(days * rent_per_day), 0) AS "totalAmountSpent"
      FROM bookings
      WHERE user_id=$1
      AND status IN ('booked', 'completed')
    `, [userId]);

    return res.json({
      data: {
        userId,
        username,
        totalBookings: result.rows[0].totalBookings,
        totalAmountSpent: result.rows[0].totalAmountSpent
      }
    });

  }

  if (bookingId) {

    const result = await pool.query(`SELECT 
      id, car_name, days, rent_per_day, status, days*rent_per_day AS "totalCost" 
      FROM bookings WHERE id=$1 AND user_id=$2 AND status IN ('booked', 'completed')
    `, [bookingId, userId]);

    const booking = result.rows[0];

    if(!booking){
      return res.status(404).json({
        error: "Booking not found"
      });
    }
    return res.json({
      data: booking
    });
  }

  const result = await pool.query(`SELECT 
    id, car_name, days, rent_per_day, status, days*rent_per_day AS "totalCost" 
    FROM bookings WHERE user_id=$1 AND status IN ('booked', 'completed')
  `, [userId]);

  res.json({
    data: result.rows
  });
});

export default router;
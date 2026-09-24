import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { validate } from "../middleware/validator";
import { bookingSchema, updateBookingSchema } from "../schemas/bookingSchema";
import type { bookingInput } from "../schemas/bookingSchema";
import pool from "../config/database";
import type { Request } from "express";

const router = express.Router();

router.use(authMiddleware);

router.post('/', validate(bookingSchema), async (req: Request<{}, {}, bookingInput>, res) => {
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


router.put('/:bookingId', validate(updateBookingSchema), async (req, res) => {
  const userId = req.user.userId;
  const bookingId = req.params.bookingId;

  const bookingExist = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
  const booking = bookingExist.rows[0];
  if (!booking) {
    return res.status(404).json({
      error: "Booking not found"
    });
  }

  if(booking.user_id !== userId){
    return res.status(403).json({
      error: "Booking doesnt belong to user"
    });
  }

  const {status} = req.body;

  const response = await pool.query(`UPDATE bookings
    SET status=$1
    WHERE id=$2 AND user_id=$3
    RETURNING id, car_name, days, rent_per_day, status, days*rent_per_day AS totalCost`,
  [status, bookingId, userId]);

  res.json({
    data:{
      message: "Booking updated successfully",
      booking: response.rows[0]
    }
  })
});



export default router;
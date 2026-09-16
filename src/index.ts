import express from "express";
import authRoutes from "./routes/authRoutes";
import bookingRoutes from './routes/bookingRoutes';

const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/bookings', bookingRoutes);
app.get('/', (req, res) => {
  res.json({
    message: "Hello World"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

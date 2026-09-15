import type { Express } from "express";
import express from "express";

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: "Hello World"
  });
});

app.listen(PORT);
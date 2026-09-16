import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

async function authMiddleware(req: Request, res: Response, next: NextFunction){
  const token = req.headers.token as string;

  if(!token){
    return res.status(401).json({
      message: "Token missing"
    });
  }

  if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {id: number};
    req.id = decoded.id;
    next();
  } catch(error) {
    res.status(401).json({
      message: "Invalid token"
    });
  }
}

export default authMiddleware;
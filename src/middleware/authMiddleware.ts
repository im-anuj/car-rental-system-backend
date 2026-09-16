import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleware(req: Request, res: Response, next: NextFunction){
  const authorization = req.headers.authorization;

  if(!authorization){
    return res.status(401).json({
      success: false, error: "Authorization header missing"
    });
  }

  const parts = authorization.split(" ");
  if(parts.length !== 2 || parts[0] !== 'Bearer'){
    return res.status(401).json({
      success: false, error: "Token missing after Bearer"
    });
  }

  const token = parts[1];

  if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
  }

  try{
    const decoded = jwt.verify(token!, JWT_SECRET) as JwtPayload & {userId: number; username: string;};
    req.user = {
      userId: decoded.userId,
      username: decoded.username
    }
    next();
  } catch(error) {
    res.status(401).json({
      success: false, error: 'Token invalid'
    });
  }
}

export default authMiddleware;
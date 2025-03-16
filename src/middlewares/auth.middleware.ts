import { User } from "@models"
import { AuthenticatedRequest } from "@types"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

// Middleware to verify JWT token
const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return next({ status: 401, message: "Access denied. No token provided." })
  }

  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return next({ status: 401, message: "Token expired." })
          }
          return next({ status: 403, message: "Invalid token." })
        }
        const payload = decoded as jwt.JwtPayload
        const user = await User.findOne({
          _id: payload.id,
        })
        // Return an error if valid token user not found
        if (!user) return next({ status: 401, message: "Token expired." })
        req.user = payload
        next()
      }
    )
  } catch (error) {
    next(error)
  }
}

export default authMiddleware

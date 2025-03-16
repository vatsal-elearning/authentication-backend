import { NextFunction, Request, Response } from "express"
import { User } from "@models"
import { responseHelper } from "@helpers"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { AuthenticatedRequest, UserType } from "@types"
import { registerValidator, loginValidator } from "@validators"
import { redisClient } from "config/redisClient"

const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    const payload = <UserType>req.body
    const { error } = registerValidator.validate(payload)
    if (error) {
      return next({ status: 400, message: error.details[0].message })
    }
    try {
      const hashedPassword = await bcrypt.hash(payload.password, 10)
      payload.password = hashedPassword
      const user = new User({ ...payload })
      await user.save()
      responseHelper(res, 200, user, "User registered successfully.")
    } catch (err) {
      next(err)
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const { error } = loginValidator.validate(payload)
    if (error) {
      return next({ status: 400, message: error.details[0].message })
    }
    try {
      const { email, password } = payload
      const user = await User.findOne({ email }).select("password")
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return next({ status: 401, message: "Invalid credentials" })
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
      )
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: "7d" }
      )

      user.refreshToken = refreshToken
      await user.save()
      await redisClient.set(user.id, refreshToken, { EX: 604800 }) // Store in Redis

      res.cookie("token", token, { httpOnly: true })

      responseHelper(
        res,
        200,
        { token, refreshToken },
        "User logged in successfully."
      )
    } catch (err) {
      next(err)
    }
  },
  profile: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id
      const user = await User.findById(userId).select("-password")
      responseHelper(res, 200, user, "User profile fetched successfully.")
    } catch (err) {
      next(err)
    }
  },
  refreshToken: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) return next({ status: 401, message: "Unauthorized" })

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        async (err: any, decoded: any) => {
          if (err) return next({ status: 403, message: "Forbidden" })

          const storedToken = await redisClient.get(decoded.id)
          if (!storedToken || storedToken !== refreshToken)
            return next({ status: 403, message: "Forbidden" })

          const newToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
          )
          res.cookie("token", newToken, { httpOnly: true })
          responseHelper(
            res,
            200,
            { token: newToken },
            "New token fetched successfully."
          )
        }
      )
    } catch (err) {
      next(err)
    }
  },
  logOut: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await redisClient.del(req.user.id)
      res.clearCookie("token")
      responseHelper(res, 200, null, "User is logged out successfully.")
    } catch (err) {
      next(err)
    }
  },
}

export default authController

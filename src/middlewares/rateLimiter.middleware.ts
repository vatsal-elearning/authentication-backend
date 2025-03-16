import rateLimit from "express-rate-limit"
import RedisStore from "rate-limit-redis"
import { redisClient } from "./../config/redisClient"

// Rate limiter middleware using Redis
const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: async (...args: string[]) => {
      return redisClient.sendCommand(args)
    },
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Limit each IP to 10 requests per window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    return res.status(429).json({
      success: false,
      message: "Rate limit exceeded. Please try again later.",
    })
  },
})

export default rateLimiter

import express from "express"
import cors from "cors"
import { connectDB } from "./config/db"
import router from "@routes"
import { errorMiddleware, rateLimiter } from "@middlewares"
import helmet from "helmet"
import cookieParser from "cookie-parser"

const app = express()

// Use JSON parsing middleware
app.use(express.json())
app.use(helmet())
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(cookieParser())
app.use(rateLimiter) // Apply rate limiter

app.use("/api", router)

// DB Connection
connectDB()

// Global error handling middleware
app.use(errorMiddleware)

export default app
